// supabaseChannelManager.js
import { supabase } from "../lib/supabase";

class SupabaseChannelManager {
  static instances = {};

  channel = null;
  tableName;
  filter;
  listeners = [];

  static getInstance(tableName, filter) {
    const instanceKey = `${tableName}-${filter}`;

    if (!SupabaseChannelManager.instances[instanceKey]) {
      SupabaseChannelManager.instances[instanceKey] = new SupabaseChannelManager(tableName, filter);
    }

    return SupabaseChannelManager.instances[instanceKey];
  }

  constructor(tableName, filter) {
    this.tableName = tableName;
    this.filter = filter;
    this.subscribeToChannel();
  }

  subscribeToChannel() {
    this.channel = supabase
      .channel("table-filter-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: this.tableName,
          filter: `id=eq.${this.filter}`,
        },
        (payload) => {
          this.notifyListeners(payload.new.testData);
        }
      )
      .subscribe();
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    console.log("I WAS HERE")
    console.log(this.listeners)
    this.listeners = this.listeners.filter((l) => l !== listener);
    console.log(this.listeners)
  }

  notifyListeners(data) {

    console.log("NOTIFYING LISTENERS", data)
    this.listeners.forEach((listener) => listener(data));
  }
}

export const supabaseChannelManager = (tableName, filter) => SupabaseChannelManager.getInstance(tableName, filter);