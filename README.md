# No nitro upsell

Removes ALL of Discord's nitro upsells by tricking the client into thinking you have nitro.

[![Install in Replugged](https://img.shields.io/badge/-Install%20in%20Replugged-blue?style=for-the-badge&logo=none)](https://replugged.dev/install?identifier=dev.albertp.NoNitroUpsell)

## Notes

⚠️ THIS DOES NOT GIVE YOU ACCESS TO NITRO FEATURES. THOSE ARE RESTRICTED SERVER-SIDE. ⚠️

### For plugin developers

This plugin adds a `user._realPremiumType` property on the current user object, which you can use in
your plugins if you need to check if a user actually has nitro (ie for a backend gated feature). To
make sure that it will work with or without this plugin, you should use the following code:

```ts
const actualPremiumType: number = user._realPremiumType ?? user.premiumType ?? 0;
```

(Note that you may have to update the type of `user` or ignore the type error)
