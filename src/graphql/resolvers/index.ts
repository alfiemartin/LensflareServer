import { AppleAuthResolver } from "./appleAuthResolver";
import { DevResolver } from "./devResolver";
import { PostResolver } from "./postResolver";
import { UserResolver } from "./userResolver";

const allResolvers = [DevResolver, UserResolver, AppleAuthResolver, PostResolver];

export default allResolvers;
export { DevResolver, UserResolver, AppleAuthResolver, PostResolver };
