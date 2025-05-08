import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, arrayUnion, query, where, setDoc } from 'firebase/firestore';
import firebaseService from "./firebase";
import { mockContests } from "@/lib/mockContests";

// Get the db instance from the imported service
const db = firebaseService.db;

// Collections
const contestsCollection = collection(db, 'contests');
const contestEntriesCollection = collection(db, 'contestEntries');

export interface Contest {
  id: string;
  title: string;
  description: string;
  category: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  endDate: string;
  featured: boolean;
  difficulty?: string;
}

export interface ContestEntry {
  id?: string;
  contestId: string;
  userId: string;
  entryTimestamp: string;
  transactionHash: string;
}

// Get all contests
export const getContests = async (): Promise<Contest[]> => {
  try {
    const querySnapshot = await getDocs(contestsCollection);
    const contests: Contest[] = [];
    
    querySnapshot.forEach((doc) => {
      contests.push({ id: doc.id, ...doc.data() } as Contest);
    });
    
    console.log(`Retrieved ${contests.length} contests from Firestore`);
    
    // If no contests found, initialize with mock data and fetch again
    if (contests.length === 0) {
      console.log("No contests found, initializing with mock data...");
      await initializeContestsFromMockData();
      return getContests(); // Call recursively after initialization
    }
    
    return contests;
  } catch (error) {
    console.error('Error getting contests:', error);
    // On error, return mock contests as fallback
    console.log("Returning mock contests as fallback");
    return mockContests as Contest[];
  }
};

// Add a single contest with a specific ID
export const addContest = async (id: string, contestData: Omit<Contest, 'id'>): Promise<boolean> => {
  try {
    const contestRef = doc(db, 'contests', id);
    await setDoc(contestRef, contestData);
    console.log(`Added contest with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('Error adding contest:', error);
    return false;
  }
};

// Initialize contests from mock data
export const initializeContestsFromMockData = async (): Promise<boolean> => {
  try {
    console.log("Initializing contests from mock data...");
    
    // Use Promise.all to add all contests in parallel
    await Promise.all(mockContests.map(async (contest) => {
      const { id, ...contestData } = contest;
      await addContest(id, contestData);
    }));
    
    console.log("Successfully initialized contests from mock data");
    return true;
  } catch (error) {
    console.error('Error initializing contests from mock data:', error);
    return false;
  }
};

// Save a user's entry in a contest
export const saveContestEntry = async (entry: ContestEntry): Promise<boolean> => {
  try {
    // Add entry to contestEntries collection
    await addDoc(contestEntriesCollection, {
      ...entry,
      entryTimestamp: entry.entryTimestamp || new Date().toISOString()
    });
    
    // Increment participants count in the contest document
    const contestDoc = doc(contestsCollection, entry.contestId);
    const contestSnapshot = await getDoc(contestDoc);
    
    if (contestSnapshot.exists()) {
      const contestData = contestSnapshot.data();
      await updateDoc(contestDoc, {
        participants: (contestData?.participants || 0) + 1,
        participants_list: arrayUnion(entry.userId)
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving contest entry:', error);
    return false;
  }
};

// Check if user has already entered a contest
export const hasUserEnteredContest = async (userId: string, contestId: string): Promise<boolean> => {
  try {
    const q = query(
      contestEntriesCollection, 
      where('userId', '==', userId),
      where('contestId', '==', contestId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking contest entry:', error);
    return false;
  }
};

export default {
  getContests,
  saveContestEntry,
  hasUserEnteredContest,
  initializeContestsFromMockData,
  addContest
};