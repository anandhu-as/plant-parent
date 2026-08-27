import { eq } from "drizzle-orm";
import { db } from "../db";
import { households } from "../db/schema";
import { generateHouseholdToken } from "../token";
const houseHoldName: string = "Ente veed";
//pushing the token and HouseHoldName into db 
export const createHouseHold = async (name: string = houseHoldName) => {

    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const [household] = await db.insert(households)
                .values({ token: generateHouseholdToken(), name })
                .returning();
            if (!household) {
                throw new Error("Failed to create household");
            }
            return household
        } catch (error) {
            if (attempt === 4) throw (error)
        }
    }
    throw new Error("Failed to create household after 5 attempts");
}
//household by token..
export const getHouseHoldByToken = async (token: string) => {
    const [household] = await db.select()
        .from(households)
        .where(eq(households.token, token))
        .limit(1);
    return household ?? null
}
//export const deleteHouseHold = async (token: string) => {
//deleting from db
//await db.delete(households).where(eq(households.token, token))
//}