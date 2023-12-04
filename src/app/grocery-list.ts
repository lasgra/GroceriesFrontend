import { GroceryEntry } from "./grocery-entry"

export interface GroceryList {
    id? : number
    name : string
    groceryEntries : GroceryEntry[]
}
