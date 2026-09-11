/**
 * BitEe - Supabase Cloud Database Client
 * Handles community sandwiches, cloud saving, public deep-links, and global telemetry.
 */

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    const savedUrl = localStorage.getItem('bitee_supabase_url');
    const savedKey = localStorage.getItem('bitee_supabase_key');

    const url = savedUrl || window.VITE_SUPABASE_URL || window.SUPABASE_URL || "";
    const key = savedKey || window.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || "";

    if (url && key && url.startsWith('http') && window.supabase) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isConfigured = true;
      } catch (err) {
        console.warn("Supabase init failed:", err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
    }
  }

  saveConfig(url, key) {
    if (url && key) {
      localStorage.setItem('bitee_supabase_url', url.trim());
      localStorage.setItem('bitee_supabase_key', key.trim());
      this.init();
      return this.isConfigured;
    }
    return false;
  }

  clearConfig() {
    localStorage.removeItem('bitee_supabase_url');
    localStorage.removeItem('bitee_supabase_key');
    this.client = null;
    this.isConfigured = false;
  }

  /**
   * Saves sandwich to Supabase 'sandwiches' table
   * @param {Object} data { name, creator, efficiency, biteAngle, totalThickness, flavorLift, layers }
   */
  async saveSandwich(data) {
    // If Supabase is connected, save to DB
    if (this.isConfigured && this.client) {
      try {
        const payload = {
          name: data.name || "Custom Sandwich",
          creator_name: data.creator || "Anonymous Sandwich Engineer",
          efficiency: data.efficiency,
          bite_angle: data.biteAngle,
          total_thickness: data.totalThickness,
          flavor_lift: data.flavorLift,
          layers: data.layers,
          upvotes: 0
        };

        const { data: result, error } = await this.client
          .from('sandwiches')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        return { success: true, id: result.id, data: result, isCloud: true };
      } catch (err) {
        console.warn("Supabase save error, falling back to local:", err);
      }
    }

    // Local fallback: Save to localStorage and encode in URL
    const localId = `local_${Date.now()}`;
    const localSaves = JSON.parse(localStorage.getItem('bitee_saved_sandwiches') || '[]');
    const localItem = {
      id: localId,
      name: data.name || "Custom Sandwich",
      creator_name: data.creator || "Anonymous Sandwich Engineer",
      efficiency: data.efficiency,
      bite_angle: data.biteAngle,
      total_thickness: data.totalThickness,
      flavor_lift: data.flavorLift,
      layers: data.layers,
      upvotes: 1,
      created_at: new Date().toISOString()
    };
    localSaves.unshift(localItem);
    localStorage.setItem('bitee_saved_sandwiches', JSON.stringify(localSaves.slice(0, 30)));

    return { 
      success: true, 
      id: localId, 
      data: localItem, 
      isCloud: false,
      encodedParam: encodeURIComponent(JSON.stringify(data.layers))
    };
  }

  /**
   * Fetches sandwich by ID (from Supabase or local storage / encoded params)
   */
  async getSandwichById(id) {
    if (this.isConfigured && this.client && !id.startsWith('local_')) {
      try {
        const { data, error } = await this.client
          .from('sandwiches')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase getSandwich error:", err);
      }
    }

    // Check localStorage
    const localSaves = JSON.parse(localStorage.getItem('bitee_saved_sandwiches') || '[]');
    const found = localSaves.find(s => s.id === id);
    return found || null;
  }

  /**
   * Fetches community sandwiches for Public Airframe Hangar
   */
  async getCommunitySandwiches(limit = 12) {
    if (this.isConfigured && this.client) {
      try {
        const { data, error } = await this.client
          .from('sandwiches')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase fetch community error:", err);
      }
    }

    // Default mock & local community sandwiches
    const localSaves = JSON.parse(localStorage.getItem('bitee_saved_sandwiches') || '[]');
    const demoItems = [
      {
        id: "demo_1",
        name: "Triple Decker Aerofoil Sub",
        creator_name: "AeroChef_99",
        efficiency: 96,
        bite_angle: 15,
        total_thickness: 48,
        flavor_lift: 131,
        upvotes: 42,
        layers: [
          { id: "d1", name: "Brioche Bun Top", category: "Bread", thickness: 12, icon: "🍞" },
          { id: "d2", name: "Prime Angus Patty", category: "Protein", thickness: 15, icon: "🥩" },
          { id: "d3", name: "Smoked Bacon (2x)", category: "Protein", thickness: 4, icon: "🥓" },
          { id: "d4", name: "Sharp Cheddar", category: "Cheese", thickness: 5, icon: "🧀" },
          { id: "d5", name: "Crisp Butter Lettuce", category: "Vegetable", thickness: 5, icon: "🥬" },
          { id: "d6", name: "Special Burger Sauce", category: "Sauce", thickness: 2, icon: "🥫" },
          { id: "d7", name: "Brioche Bun Heel", category: "Bread", thickness: 10, icon: "🍞" }
        ],
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "demo_2",
        name: "The Quantum Sourdough",
        creator_name: "Dr_Sandwich_PhD",
        efficiency: 91,
        bite_angle: 15,
        total_thickness: 52,
        flavor_lift: 124,
        upvotes: 28,
        layers: [
          { id: "q1", name: "Sourdough Slice", category: "Bread", thickness: 14, icon: "🍞" },
          { id: "q2", name: "Fresh Avocado", category: "Vegetable", thickness: 7, icon: "🥑" },
          { id: "q3", name: "Crispy Fried Chicken", category: "Protein", thickness: 16, icon: "🍗" },
          { id: "q4", name: "Swiss Emmental", category: "Cheese", thickness: 4, icon: "🧀" },
          { id: "q5", name: "Spicy Sriracha Mayo", category: "Sauce", thickness: 3, icon: "🥫" },
          { id: "q6", name: "Sourdough Slice", category: "Bread", thickness: 8, icon: "🍞" }
        ],
        created_at: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      {
        id: "demo_3",
        name: "Catastrophic Tomato Overload",
        creator_name: "DisasterSimulator",
        efficiency: 34,
        bite_angle: 40,
        total_thickness: 65,
        flavor_lift: 46,
        upvotes: 19,
        layers: [
          { id: "t1", name: "Top Sesame Bun", category: "Bread", thickness: 10, icon: "🍞" },
          { id: "t2", name: "Heirloom Tomato Slice", category: "Vegetable", thickness: 20, icon: "🍅" },
          { id: "t3", name: "Heirloom Tomato Slice", category: "Vegetable", thickness: 15, icon: "🍅" },
          { id: "t4", name: "Special Burger Sauce", category: "Sauce", thickness: 10, icon: "🥫" },
          { id: "t5", name: "Bottom Bun", category: "Bread", thickness: 10, icon: "🍞" }
        ],
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];

    return [...localSaves, ...demoItems];
  }

  /**
   * Upvotes a sandwich
   */
  async upvoteSandwich(id) {
    if (this.isConfigured && this.client && !id.startsWith('demo_') && !id.startsWith('local_')) {
      try {
        const { data } = await this.client.from('sandwiches').select('upvotes').eq('id', id).single();
        if (data) {
          await this.client.from('sandwiches').update({ upvotes: (data.upvotes || 0) + 1 }).eq('id', id);
          return true;
        }
      } catch (e) {
        console.warn("Upvote error:", e);
      }
    }

    const upvoted = JSON.parse(localStorage.getItem('bitee_upvoted_ids') || '[]');
    if (!upvoted.includes(id)) {
      upvoted.push(id);
      localStorage.setItem('bitee_upvoted_ids', JSON.stringify(upvoted));
    }
    return true;
  }

  /**
   * Gets global telemetry stats
   */
  async getGlobalTelemetry() {
    if (this.isConfigured && this.client) {
      try {
        const { count, error } = await this.client
          .from('sandwiches')
          .select('*', { count: 'exact', head: true });

        if (!error && typeof count === 'number') {
          return {
            totalSandwiches: 1248 + count,
            avgEfficiency: "88.4%",
            stallsPrevented: 412 + Math.floor(count * 0.35)
          };
        }
      } catch (err) {
        // fallback
      }
    }

    return {
      totalSandwiches: 1284,
      avgEfficiency: "88.2%",
      stallsPrevented: 429
    };
  }
}

export const supabaseDb = new SupabaseService();
