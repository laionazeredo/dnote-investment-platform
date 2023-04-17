export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Accounts: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
        }
      }
      Transactions: {
        Row: {
          account_id: number
          amount: number | null
          created_at: string | null
          id: number
          transaction_type: string
        }
        Insert: {
          account_id: number
          amount?: number | null
          created_at?: string | null
          id?: number
          transaction_type: string
        }
        Update: {
          account_id?: number
          amount?: number | null
          created_at?: string | null
          id?: number
          transaction_type?: string
        }
      }
      Users: {
        Row: {
          account_id: number | null
          created_at: string | null
          email: string
          id: number
          name: string
        }
        Insert: {
          account_id?: number | null
          created_at?: string | null
          email: string
          id?: number
          name: string
        }
        Update: {
          account_id?: number | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
