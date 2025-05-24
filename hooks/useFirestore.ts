import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useFirestore = <T extends DocumentData>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query with sorting and limit
        const q = query(
          collection(db, collectionName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as unknown as T[];
        
        setData(items);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data, loading, error };
};