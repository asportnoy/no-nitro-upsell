import { User } from "discord-types/general";
import { webpack } from "replugged";
import { Store } from "replugged/dist/renderer/modules/common/flux";

let user: ModifiedUser | undefined;
let lastUserId: string | undefined;

interface ModifiedUser extends User {
  _realPremiumType?: number;
}

interface UserStore extends Store {
  addChangeListener: (listener: () => void) => void;
  removeChangeListener: (listener: () => void) => void;
  getCurrentUser: () => ModifiedUser | undefined;
}

let uninject: (() => void) | undefined;
let userStore: UserStore | undefined;

export function start(): void {
  userStore = webpack.getByStoreName<UserStore>("UserStore");
  if (!userStore) throw new Error("UserStore not found");
  const { addChangeListener, removeChangeListener, getCurrentUser } = userStore;

  user = getCurrentUser();
  if (user) ready(user);

  const onChange = (): void => {
    const newUser = getCurrentUser();
    if (newUser && newUser.id !== lastUserId) {
      user = newUser;
      ready(user);
    }
  };

  addChangeListener(onChange);
  uninject = () => removeChangeListener(onChange);
}

function ready(user: ModifiedUser): void {
  if (!user) return;
  if ("_realPremiumType" in user) return;

  user._realPremiumType = user.premiumType ?? 0;
  user.premiumType = 2;
  lastUserId = user.id;
}

export function stop(): void {
  uninject?.();

  if (!userStore) return;
  const { getCurrentUser } = userStore;
  const user = getCurrentUser();
  if (!user) return;
  if (!("_realPremiumType" in user)) return;
  user.premiumType = user._realPremiumType;
  delete user._realPremiumType;
}
