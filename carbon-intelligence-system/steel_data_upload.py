import pickle
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# 🔹 Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# 🔹 Load your .pkl file
with open("steel_data.pkl", "rb") as f:
    df = pickle.load(f)

# If it's not DataFrame, convert it
if not isinstance(df, pd.DataFrame):
    df = pd.DataFrame(df)

# 🔹 Upload to Firestore
factory_id = "factory_002"

for index, row in df.iterrows():

    doc_data = row.to_dict()

    # Optional: convert numpy types to normal Python types
    for key in doc_data:
        if pd.isna(doc_data[key]):
            doc_data[key] = None

    db.collection("factories") \
      .document(factory_id) \
      .collection("raw_data") \
      .add(doc_data)

print("✅ Steel data uploaded successfully")
