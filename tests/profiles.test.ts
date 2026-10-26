import { expect, it, vi } from "vitest";
const mocks = vi.hoisted(()=>({create:vi.fn(),set:vi.fn(),get:vi.fn()}));
vi.mock("@/server/firebase/admin",()=>({adminServices:()=>({db:{doc:(path:string)=>({path}),runTransaction:async(fn:(tx:unknown)=>Promise<void>)=>fn(mocks)}})}));
import { ensureProfile } from "@/server/profiles";
it("initializes customer membership regardless of caller claims",async()=>{process.env.SALON_ID="lashess-priir";mocks.get.mockResolvedValueOnce({exists:false}).mockResolvedValueOnce({exists:false}).mockResolvedValueOnce({exists:true,data:()=>({active:true})});await ensureProfile({uid:"user-1",name:"Client",role:"owner"} as never);expect(mocks.create).toHaveBeenCalledWith({path:"salons/lashess-priir/members/user-1"},expect.objectContaining({role:"customer",uid:"user-1",salonId:"lashess-priir"}));});
it("does not overwrite an existing membership",async()=>{mocks.create.mockClear();mocks.get.mockResolvedValueOnce({exists:true}).mockResolvedValueOnce({exists:true}).mockResolvedValueOnce({exists:true,data:()=>({active:true})});await ensureProfile({uid:"user-1"} as never);expect(mocks.create).not.toHaveBeenCalled();});
