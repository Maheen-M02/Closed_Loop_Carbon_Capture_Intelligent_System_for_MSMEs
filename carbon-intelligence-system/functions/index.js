const { Timestamp } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.rawDataTrigger = onDocumentCreated(
  "factories/{factoryId}/raw_data/{docId}",
  async (event) => {
    console.log("🔥 rawDataTrigger FIRED");
    if (!event.data) {
      console.log("❌ event.data is undefined");
      return;
    }
    const data = event.data.data();
    console.log("✅ Raw data received:", data);
    const { factoryId } = event.params;
    console.log("Factory ID:", factoryId);

    // 🔹 Get factory profile to detect industry
    let factoryDoc;
    try {
      factoryDoc = await admin.firestore().collection("factories").doc(factoryId).get();
    } catch (error) {
      console.log("❌ Error fetching factory document:", error);
      return;
    }
    if (!factoryDoc.exists) {
      console.log("❌ Factory document does not exist:", factoryId);
      return;
    }
    console.log("✅ Factory document found");

    const factoryProfile = factoryDoc.data();
    const industry = factoryProfile.industry_type;

    let total_co2_kg = 0;
    let emissionBreakdown = {};

    // ==========================
    // 🧵 TEXTILE INDUSTRY LOGIC
    // ==========================
    if (industry === "textile") {

      const ELECTRICITY_FACTOR = 0.82;
      const DIESEL_FACTOR = 2.68;
      const COAL_FACTOR = 2.42;
      const LPG_FACTOR = 3.00;

      const electricity_co2 = (data.electricity_kwh || 0) * ELECTRICITY_FACTOR;
      const diesel_co2 = (data.diesel_liters || 0) * DIESEL_FACTOR;
      const coal_co2 = (data.coal_kg || 0) * COAL_FACTOR;
      const lpg_co2 = (data.lpg_kg || 0) * LPG_FACTOR;

      total_co2_kg =
        electricity_co2 +
        diesel_co2 +
        coal_co2 +
        lpg_co2;

      emissionBreakdown = {
        electricity_co2,
        diesel_co2,
        coal_co2,
        lpg_co2
      };

      console.log("Textile Total CO2 (kg):", total_co2_kg);
    }

    // ==========================
    // 🏭 STEEL INDUSTRY LOGIC
    // ==========================
    if (industry === "steel") {

      const GRID_FACTOR = 0.82;

      const base_co2 = (data.Usage_kWh || 0) * GRID_FACTOR;

      const avg_pf =
        ((data.Lagging_Current_Power_Factor || 0) +
         (data.Leading_Current_Power_Factor || 0)) / 2;

      let pf_penalty = 0;
      if (avg_pf < 0.9) {
        pf_penalty = (0.9 - avg_pf) * 0.05 * base_co2;
      }

      let spike_penalty = 0;
      if ((data.Energy_Change_Rate || 0) > 0.1) {
        spike_penalty = 0.03 * base_co2;
      }

      let anomaly_penalty = 0;
      if (data.Anomaly === true) {
        anomaly_penalty = 0.05 * base_co2;
      }

      total_co2_kg =
        base_co2 +
        pf_penalty +
        spike_penalty +
        anomaly_penalty;

      emissionBreakdown = {
        base_co2,
        pf_penalty,
        spike_penalty,
        anomaly_penalty,
        avg_power_factor: avg_pf
      };

      console.log("Steel Base CO2:", base_co2);
      console.log("Steel Total CO2 (kg):", total_co2_kg);
    }

    const total_co2_tons = total_co2_kg / 1000;

    console.log("Final CO2 (tons):", total_co2_tons);

    // ==========================
    // 💾 STORE EMISSION DOCUMENT
    // ==========================
    await admin.firestore()
      .collection("factories")
      .doc(factoryId)
      .collection("emissions")
      .add({
        industry,
        ...emissionBreakdown,
        total_co2_kg,
        total_co2_tons,
        production_units: data.production_units || 0,
        createdAt: Timestamp.now()
      });

    console.log("✅ Emission document stored successfully");

    return;
  }
);
exports.emissionKPITrigger = onDocumentCreated(
  "factories/{factoryId}/emissions/{docId}",
  async (event) => {

    const emissionData = event.data.data();
    const { factoryId } = event.params;

    const industry = emissionData.industry;
    const total_co2_kg = emissionData.total_co2_kg;
    const production_units = emissionData.production_units || 1;

    const carbon_intensity = total_co2_kg / production_units;

    // 🔹 Get last 24 emissions for rolling average
    const emissionsSnapshot = await admin.firestore().collection("factories").doc(factoryId).collection("emissions").orderBy("createdAt", "desc").limit(24).get();
    let totalIntensity = 0;
    let count = 0;
    emissionsSnapshot.forEach(doc => {
      const e = doc.data();
      const intensity = (e.total_co2_kg || 0) / (e.production_units || 1);
      totalIntensity += intensity;
      count++;
    });
    const rolling_mean_intensity = count > 0 ? totalIntensity / count : carbon_intensity;
    console.log("Rolling 24h Carbon Intensity:", rolling_mean_intensity);

    let risk_score = 0;
    let efficiency_score = null;

    if (industry=== "textile") {

      if (carbon_intensity > 5) {
        risk_score += 30;
      }

      if ((emissionData.coal_co2 || 0) > 500) {
        risk_score += 20;
      }

    }

    if (industry=== "steel") {

      const avg_pf = emissionData.avg_power_factor || 0;
      efficiency_score = avg_pf * 100;

      if (avg_pf < 0.85) {
        risk_score += 40;
      }

      if ((emissionData.anomaly_penalty || 0) > 0) {
        risk_score += 30;
      }

      if ((emissionData.spike_penalty || 0) > 0) {
        risk_score += 20;
      }

    }

    await admin.firestore()
      .collection("factories")
      .doc(factoryId)
      .collection("metrics")
      .add({
        industry,
        carbon_intensity,
        rolling_mean_carbon_intensity_24h: rolling_mean_intensity,
        efficiency_score,
        risk_score,
        createdAt: Timestamp.now()
      });

    console.log("✅ KPI Metrics stored");

    return;
  }
);
