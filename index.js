const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

module.exports = class NoNitroUpsell extends Plugin {
	async startPlugin() {
		this.getCurrentUser = getModule(['getCurrentUser'], false).getCurrentUser;

		this.currentUser = this.getCurrentUser();

		if (this.currentUser) {
			this.disableUpsells();
		} else {
			// Keep checking until there is a user
			const checkInterval = setInterval(() => {
				this.currentUser = this.getCurrentUser();
				if (this.currentUser) {
					clearInterval(checkInterval);
					this.disableUpsells();
					return;
				}

			}, 1000);
		}
	}

	disableUpsells() {
		this.defaultValue = this.currentUser.premiumType;

		this.currentUser.premiumType = 2;
	}

	pluginWillUnload() {
		if (this.defaultValue !== undefined) this.currentUser.premiumType = this.defaultValue;
	}
};
