import { useState, useEffect } from "react";
import { supabaseChannelManager } from "./supabaseChannelManager";
import { supabase } from "../lib/supabase";


export const useSupabaseChannel = (tableName, filter) => {
  const [data, setData] = useState([]);
  const channelManager = supabaseChannelManager(tableName, filter);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: getTest, error: errorTest } = await supabase
          .from(tableName)
          .select('testData')
          .eq('id', filter)
          .single();

        if (errorTest) {
          console.error('Error fetching initial testData:', errorTest);
        } else {
          setData(getTest.testData);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    const handleDataUpdate = (newData) => {
      setData(newData);
    };

    channelManager.addListener(handleDataUpdate);

    return () => {
        channelManager.removeListener(handleDataUpdate);
    };
  }, [tableName, filter]);

  return data;
};