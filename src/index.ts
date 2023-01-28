import { User } from "discord-types/general";
import { webpack } from "replugged";

let initialValue: number | undefined;
let user: User | undefined;
let lastUserId: string | undefined;

export async function start(): Promise<void> {
  const { addChangeListener, getCurrentUser } = await webpack.waitForModule<{
    addChangeListener: (listener: () => void) => void;
    getCurrentUser: () => User | undefined;
  }>(webpack.filters.byProps("getCurrentUser", "getUser"));

  user = getCurrentUser();
  if (user) ready();

  addChangeListener(() => {
    const newUser = getCurrentUser();
    if (newUser) {
      if (newUser.id !== lastUserId || newUser.premiumType === initialValue) {
        user = newUser;
        ready();
      }
    }
  });
}

function ready(): void {
  if (!user) return;

  initialValue = user.premiumType;
  user.premiumType = 2;
  lastUserId = user.id;
}

export function stop(): void {
  if (!user || initialValue === undefined) return;
  user.premiumType = initialValue;
}
