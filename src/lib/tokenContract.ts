import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction, 
  getAccount, 
  getMint,
  createAssociatedTokenAccountInstruction 
} from '@solana/spl-token';

// Your custom token contract address on Solana devnet
const TOKEN_MINT_ADDRESS = 'FGn3YwW5iMDe2Sz7ekYTV8ZvAdmQmzeSGpFEsAjHEQnm';
// The address where contest entry fees should be sent
const RECEIVER_ADDRESS = 'EhFTWzaEXM9baSFSMM22cJiG8KjmsMLiFWi27DVc2Zq6';

// Devnet connection
const getConnection = () => {
  return new Connection('https://api.devnet.solana.com', 'confirmed');
};

// Helper function to check if a string is a valid Solana address
const isValidSolanaAddress = (address: string): boolean => {
  try {
    if (!address) {
      console.error('Empty address provided');
      return false;
    }
    
    // Only trim whitespace without changing case
    const cleanAddress = address.trim();
    
    // Validate as Solana public key
    new PublicKey(cleanAddress);
    return true;
  } catch (error) {
    console.error('Invalid Solana address format:', error, 'Address:', address);
    return false;
  }
};

export const TokenService = {
  // Get the token balance for a user
  async getTokenBalance(userAddress: string): Promise<number> {
    try {
      if (!userAddress) {
        console.error('No user address provided');
        return 0;
      }
      
      // Clean the address before validating
      const cleanAddress = userAddress.trim();
      
      // Check if the address is a valid Solana address
      if (!isValidSolanaAddress(cleanAddress)) {
        console.error('Invalid Solana address format:', cleanAddress);
        return 0;
      }
      
      const connection = getConnection();
      const userPublicKey = new PublicKey(cleanAddress);
      const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
      
      console.log('Getting associated token address for:', {
        mint: TOKEN_MINT_ADDRESS,
        owner: cleanAddress
      });
      
      // Get the associated token account address
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        userPublicKey
      );
      
      console.log('Token account address:', tokenAccountAddress.toString());
      
      try {
        // Get token account info
        const tokenAccount = await getAccount(connection, tokenAccountAddress);
        console.log('Token account found:', tokenAccount);
        
        // Get mint info to get decimals
        const mintInfo = await getMint(connection, mintPublicKey);
        
        // Calculate actual balance with decimals
        const balance = Number(tokenAccount.amount) / Math.pow(10, mintInfo.decimals);
        console.log('Calculated balance:', balance);
        return balance;
      } catch (error) {
        // Check specifically for TokenAccountNotFoundError
        if (
          error.name === 'TokenAccountNotFoundError' ||
          error.message?.includes('not found') || 
          error.message?.includes('does not exist') ||
          error.message?.includes('could not find account')
        ) {
          console.log('Token account does not exist yet for this address, returning 0 balance');
          return 0;
        } else {
          console.error('Unexpected error getting token account:', error);
          throw error; // Re-throw unexpected errors
        }
      }
    } catch (error) {
      console.error('Error in getTokenBalance:', error);
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  },
  
  // Helper function to check if a token account exists
  async checkTokenAccountExists(userAddress: string): Promise<boolean> {
    try {
      const connection = getConnection();
      const userPublicKey = new PublicKey(userAddress.trim());
      const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
      
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        userPublicKey
      );
      
      try {
        await getAccount(connection, tokenAccountAddress);
        return true; // Account exists
      } catch (error) {
        return false; // Account doesn't exist
      }
    } catch (error) {
      console.error('Error checking if token account exists:', error);
      return false;
    }
  },
  
  // Create a token account for a user using Civic wallet
  async createTokenAccount(userAddress: string, civicWallet: any): Promise<string> {
    try {
      // Clean the address
      const cleanAddress = userAddress.trim();
      
      // Check if the address is a valid Solana address
      if (!isValidSolanaAddress(cleanAddress)) {
        throw new Error(`Invalid Solana address format: ${cleanAddress}`);
      }
      
      const connection = getConnection();
      const userPublicKey = new PublicKey(cleanAddress);
      const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
      
      // Get the associated token address
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        userPublicKey
      );
      
      // Check if the account already exists
      const accountExists = await this.checkTokenAccountExists(cleanAddress);
      if (accountExists) {
        console.log('Token account already exists');
        return tokenAccountAddress.toString();
      }
      
      // Create instruction to create the associated token account
      const createAccountInstruction = createAssociatedTokenAccountInstruction(
        userPublicKey, // payer
        tokenAccountAddress, // associated token account address
        userPublicKey, // owner
        mintPublicKey // token mint
      );
      
      // Create transaction and add the instruction
      const transaction = new Transaction().add(createAccountInstruction);
      
      // Set recent blockhash and fee payer
      transaction.feePayer = userPublicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      console.log('Transaction created, requesting signature...');
      
      // Request signature from the Civic wallet
      const signedTransaction = await civicWallet.signTransaction(transaction);
      
      console.log('Transaction signed, sending to network...');
      
      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('Transaction sent, waiting for confirmation...', signature);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      console.log('Token account created:', tokenAccountAddress.toString());
      
      return tokenAccountAddress.toString();
    } catch (error: any) {
      console.error('Error creating token account:', error);
      throw new Error(error.message || 'Failed to create token account');
    }
  },
  
  // Transfer tokens for contest entry using Civic wallet
  async enterContest(userAddress: string, amount: number, civicWallet: any): Promise<string> {
    try {
      // Clean the address
      const cleanAddress = userAddress.trim();
      
      // Check if the address is a valid Solana address
      if (!isValidSolanaAddress(cleanAddress)) {
        throw new Error(`Invalid Solana address format: ${cleanAddress}`);
      }
      
      const connection = getConnection();
      const userPublicKey = new PublicKey(cleanAddress);
      const receiverPublicKey = new PublicKey(RECEIVER_ADDRESS);
      const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
      
      // Get the associated token accounts for sender and receiver
      const senderTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        userPublicKey
      );
      
      const receiverTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        receiverPublicKey
      );
      
      // Check if sender token account exists
      const senderAccountExists = await this.checkTokenAccountExists(cleanAddress);
      if (!senderAccountExists) {
        console.log('Sender token account does not exist, creating it...');
        await this.createTokenAccount(cleanAddress, civicWallet);
      }
      
      // Check if receiver token account exists
      const receiverAccountExists = await this.checkTokenAccountExists(RECEIVER_ADDRESS);
      
      // Create transaction
      const transaction = new Transaction();
      
      // If receiver token account doesn't exist, add instruction to create it
      if (!receiverAccountExists) {
        console.log('Receiver token account does not exist, adding creation instruction...');
        const createReceiverAccountInstruction = createAssociatedTokenAccountInstruction(
          userPublicKey, // payer
          receiverTokenAccount, // associated token account address
          receiverPublicKey, // owner
          mintPublicKey // token mint
        );
        transaction.add(createReceiverAccountInstruction);
      }
      
      // Get mint info to calculate amount with proper decimals
      const mintInfo = await getMint(connection, mintPublicKey);
      const amountToSend = Math.floor(amount * Math.pow(10, mintInfo.decimals));
      
      console.log('Transfer details:', {
        from: senderTokenAccount.toString(),
        to: receiverTokenAccount.toString(),
        amount: amountToSend,
        decimals: mintInfo.decimals
      });
      
      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        senderTokenAccount,
        receiverTokenAccount,
        userPublicKey,
        BigInt(amountToSend)
      );
      
      // Add the transfer instruction
      transaction.add(transferInstruction);
      
      // Set recent blockhash and fee payer
      transaction.feePayer = userPublicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      console.log('Transaction created, requesting signature...');
      
      // Request signature from the Civic wallet
      const signedTransaction = await civicWallet.signTransaction(transaction);
      
      console.log('Transaction signed, sending to network...');
      
      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('Transaction sent, waiting for confirmation...', signature);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature);
      
      console.log('Transaction confirmed:', signature);
      
      return signature;
    } catch (error: any) {
      console.error('Error entering contest:', error);
      throw new Error(error.message || 'Failed to process transaction');
    }
  }
};

export default TokenService;
