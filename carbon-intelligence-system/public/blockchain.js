// Simple Blockchain Implementation for Carbon Credits
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return CryptoJS.SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class CarbonCreditBlockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    async initialize(userId) {
        this.userId = userId;
        await this.loadChain();
        
        if (this.chain.length === 0) {
            this.chain = [this.createGenesisBlock()];
            await this.saveChain();
        }
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), {
            type: "GENESIS",
            message: "Carbon Credit Blockchain Initialized",
            userId: this.userId
        }, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async addCarbonCreditTransaction(emissionData) {
        const transaction = {
            type: "CARBON_CREDIT",
            userId: this.userId,
            timestamp: Date.now(),
            industry: emissionData.industry,
            totalCO2: parseFloat(emissionData.total_co2),
            carbonIntensity: parseFloat(emissionData.carbon_intensity),
            sustainabilityScore: emissionData.sustainability_score,
            baselineEmissions: emissionData.baseline_emissions,
            emissionReduction: parseFloat(emissionData.emission_reduction),
            carbonCredits: parseFloat(emissionData.carbon_credits),
            hash: this.calculateTransactionHash(emissionData)
        };

        const newBlock = new Block(
            this.chain.length,
            Date.now(),
            transaction,
            this.getLatestBlock().hash
        );

        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        
        await this.saveChain();
        return newBlock;
    }

    calculateTransactionHash(data) {
        return CryptoJS.SHA256(JSON.stringify(data) + Date.now()).toString();
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    async saveChain() {
        try {
            const chainData = this.chain.map(block => ({
                index: block.index,
                timestamp: block.timestamp,
                data: block.data,
                previousHash: block.previousHash,
                hash: block.hash,
                nonce: block.nonce
            }));

            await db.collection('users')
                .doc(this.userId)
                .collection('blockchain')
                .doc('chain')
                .set({
                    chain: chainData,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    isValid: this.isChainValid()
                });

            console.log('Blockchain saved successfully');
        } catch (error) {
            console.error('Error saving blockchain:', error);
        }
    }

    async loadChain() {
        try {
            const chainDoc = await db.collection('users')
                .doc(this.userId)
                .collection('blockchain')
                .doc('chain')
                .get();

            if (chainDoc.exists) {
                const chainData = chainDoc.data().chain;
                this.chain = chainData.map(blockData => {
                    const block = new Block(
                        blockData.index,
                        blockData.timestamp,
                        blockData.data,
                        blockData.previousHash
                    );
                    block.hash = blockData.hash;
                    block.nonce = blockData.nonce;
                    return block;
                });
                console.log('Blockchain loaded successfully');
            }
        } catch (error) {
            console.error('Error loading blockchain:', error);
        }
    }

    getTotalCarbonCredits() {
        let total = 0;
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].data.type === "CARBON_CREDIT") {
                total += this.chain[i].data.carbonCredits;
            }
        }
        return total;
    }

    getTransactionHistory() {
        return this.chain
            .filter(block => block.data.type === "CARBON_CREDIT")
            .map(block => block.data);
    }

    async verifyCarbonCredit(blockIndex) {
        if (blockIndex < 0 || blockIndex >= this.chain.length) {
            return { valid: false, message: "Block not found" };
        }

        const block = this.chain[blockIndex];
        const isHashValid = block.hash === block.calculateHash();
        const isPreviousHashValid = blockIndex === 0 || 
            block.previousHash === this.chain[blockIndex - 1].hash;

        return {
            valid: isHashValid && isPreviousHashValid,
            block: block,
            message: isHashValid && isPreviousHashValid 
                ? "Carbon credit verified and authentic" 
                : "Carbon credit verification failed - possible tampering detected"
        };
    }

    exportBlockchainCertificate() {
        const certificate = {
            userId: this.userId,
            totalBlocks: this.chain.length,
            totalCarbonCredits: this.getTotalCarbonCredits(),
            isValid: this.isChainValid(),
            genesisBlockHash: this.chain[0].hash,
            latestBlockHash: this.getLatestBlock().hash,
            exportDate: new Date().toISOString(),
            transactions: this.getTransactionHistory()
        };

        return certificate;
    }
}

// Global blockchain instance
let carbonBlockchain = null;

async function initializeBlockchain(userId) {
    carbonBlockchain = new CarbonCreditBlockchain();
    await carbonBlockchain.initialize(userId);
    return carbonBlockchain;
}

async function addCarbonCreditToBlockchain(emissionData) {
    if (!carbonBlockchain) {
        console.error('Blockchain not initialized');
        return null;
    }
    
    return await carbonBlockchain.addCarbonCreditTransaction(emissionData);
}

function getBlockchainInstance() {
    return carbonBlockchain;
}
