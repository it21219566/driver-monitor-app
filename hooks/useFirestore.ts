import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useFirestore = <T extends DocumentData>(collectionName: string, options?: { limit?: number }) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let q = query(collection(db, collectionName));
        
        // Apply sorting and limiting only if options are provided
        if (options?.limit) {
          q = query(
            collection(db, collectionName),
            orderBy('timestamp', 'desc'),
            limit(options.limit)
          );
        }

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
  }, [collectionName, options?.limit]);

  return { data, loading, error };
};