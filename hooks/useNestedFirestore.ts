import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getFirestore } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useNestedFirestore = <T extends {}>(mainCollection: string, subcollection: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mainCollectionRef = collection(db, mainCollection);
        const mainSnapshot = await getDocs(mainCollectionRef);
        
        const allItems: T[] = [];
        
        for (const mainDoc of mainSnapshot.docs) {
          const subCollectionRef = collection(doc(db, mainCollection, mainDoc.id), subcollection);
          const subSnapshot = await getDocs(subCollectionRef);
          
          subSnapshot.docs.forEach(subDoc => {
            allItems.push({
              id: subDoc.id,
              ...subDoc.data() as T
            });
          });
        }
        
        setData(allItems);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainCollection, subcollection]);

  return { data, loading, error };
};