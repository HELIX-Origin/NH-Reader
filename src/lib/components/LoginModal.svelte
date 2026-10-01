<script lang="ts">
	import {
		getAccountState,
		setApiKey,
		loginWithCredentials,
		clearApiKey,
	} from '$lib/stores/account.svelte';
	import { locale } from '$lib/stores/locale.svelte';
	import { avatarUrl } from '$lib/image';
	import Icon from './Icon.svelte';

	let { open = $bindable(false) }: { open: boolean } = $props();

	const account = $derived(getAccountState());

	let tab = $state<'apikey' | 'credentials'>('apikey');
	let keyInput = $state('');
	let usernameInput = $state('');
	let passwordInput = $state('');
	let localError = $state<string | null>(null);
	let localSuccess = $state<string | null>(null);
	let avatarLoadFailed = $state(false);

	$effect(() => {
		if (account.user?.avatar_url) {
			avatarLoadFailed = false;
		}
	});

	async function onConnectKey(e: SubmitEvent) {
		e.preventDefault();
		if (!keyInput.trim()) return;
		localError = null;
		localSuccess = null;
		try {
			await setApiKey(keyInput.trim());
			localSuccess = locale.t('account.connected');
			keyInput = '';
		} catch (err) {
			localError = String(err);
		}
	}

	async function onConnectCredentials(e: SubmitEvent) {
		e.preventDefault();
		if (!usernameInput.trim() || !passwordInput) return;
		localError = null;
		localSuccess = null;
		try {
			await loginWithCredentials({
				username: usernameInput.trim(),
				password: passwordInput,
			});
			localSuccess = locale.t('account.connected');
			usernameInput = '';
			passwordInput = '';
		} catch (err) {
			localError = String(err);
		}
	}

	async function onDisconnect() {
		localError = null;
		localSuccess = null;
		try {
			await clearApiKey();
		} catch (err) {
			localError = String(err);
		}
	}

	function close() {
		open = false;
		localError = null;
		localSuccess = null;
	}
</script>

{#if open}
	<div
		class="modal-backdrop"
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') close();
		}}
		role="presentation"
	>
		<div
			class="modal-window"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<div class="modal-header">
				<div class="title-wrap">
					<Icon name="user" size={18} />
					<h2 id="modal-title">{locale.t('account.loginTitle')}</h2>
				</div>
				<button
					class="close-btn"
					onclick={close}
					title={locale.t('account.close')}
					aria-label={locale.t('account.close')}
				>
					<Icon name="close" size={16} />
				</button>
			</div>

			<div class="modal-body">
				{#if account.keyStatus.configured}
					<div class="connected-card">
						<div class="avatar-wrap">
							{#if account.user?.avatar_url && !avatarLoadFailed}
								<img
									class="user-avatar"
									src={avatarUrl(account.user.avatar_url)}
									alt={account.user?.username ?? ''}
									onerror={() => {
										avatarLoadFailed = true;
									}}
								/>
							{:else}
								<div class="user-avatar placeholder">
									{account.user?.username ? account.user.username[0].toUpperCase() : 'U'}
								</div>
							{/if}
							<span class="status-indicator"></span>
						</div>
						<div class="user-info">
							<div class="user-name-line">
								<span class="user-name">{account.user?.username ?? locale.t('account.connected')}</span>
								{#if account.user?.id}
									<span class="user-id">#{account.user.id}</span>
								{/if}
							</div>
							<div class="account-meta">
								<span class="status-text">{locale.t('account.connected')}</span>
								<span class="dot-sep">•</span>
								<code class="key-badge">{account.keyStatus.prefix}••••••••</code>
							</div>
						</div>
					</div>

					<div class="modal-actions">
						<button
							class="btn"
							onclick={close}
						>
							{locale.t('account.close')}
						</button>
						<button
							class="btn btn-danger"
							onclick={onDisconnect}
							disabled={account.busy}
						>
							{locale.t('account.disconnectButton')}
						</button>
					</div>
				{:else}
					<div class="tab-bar">
						<button
							class="tab-btn"
							class:active={tab === 'apikey'}
							onclick={() => {
								tab = 'apikey';
								localError = null;
							}}
						>
							{locale.t('account.tabApiKey')}
						</button>
						<button
							class="tab-btn"
							class:active={tab === 'credentials'}
							onclick={() => {
								tab = 'credentials';
								localError = null;
							}}
						>
							{locale.t('account.tabCredentials')}
						</button>
					</div>

					{#if tab === 'apikey'}
						<form class="form" onsubmit={onConnectKey}>
							<p class="desc">{locale.t('account.apiKeyDesc')}</p>
							<a
								class="link-help"
								href="https://nhentai.net/user/settings#apikeys"
								target="_blank"
								rel="noreferrer"
							>
								<Icon name="external" size={14} />
								<span>{locale.t('account.apiKeyHelpLink')}</span>
							</a>
							<div class="field">
								<input
									class="input"
									type="password"
									placeholder={locale.t('settings.apiKeyPlaceholder')}
									bind:value={keyInput}
									disabled={account.busy}
									autocomplete="off"
								/>
							</div>
							<div class="modal-actions">
								<button
									class="btn"
									type="button"
									onclick={close}
								>
									{locale.t('account.close')}
								</button>
								<button
									class="btn btn-primary"
									type="submit"
									disabled={account.busy || !keyInput.trim()}
								>
									{account.busy ? locale.t('account.connecting') : locale.t('account.connectButton')}
								</button>
							</div>
						</form>
					{:else}
						<form class="form" onsubmit={onConnectCredentials}>
							<p class="desc notice">{locale.t('account.credentialsNotice')}</p>
							<div class="field">
								<label for="login-username">{locale.t('account.usernameLabel')}</label>
								<input
									id="login-username"
									class="input"
									type="text"
									bind:value={usernameInput}
									disabled={account.busy}
									autocomplete="username"
								/>
							</div>
							<div class="field">
								<label for="login-password">{locale.t('account.passwordLabel')}</label>
								<input
									id="login-password"
									class="input"
									type="password"
									bind:value={passwordInput}
									disabled={account.busy}
									autocomplete="current-password"
								/>
							</div>
							<div class="modal-actions">
								<button
									class="btn"
									type="button"
									onclick={close}
								>
									{locale.t('account.close')}
								</button>
								<button
									class="btn btn-primary"
									type="submit"
									disabled={account.busy || !usernameInput.trim() || !passwordInput}
								>
									{account.busy ? locale.t('account.connecting') : locale.t('account.connectButton')}
								</button>
							</div>
						</form>
					{/if}
				{/if}

				{#if localError || account.error}
					<p class="message error">{localError ?? account.error}</p>
				{/if}
				{#if localSuccess}
					<p class="message success">{localSuccess}</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(8px);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.modal-window {
		background: #1f1f1f;
		border: 1px solid #383838;
		border-radius: 8px;
		width: 100%;
		max-width: 440px;
		box-shadow: 0 20px 48px rgba(0, 0, 0, 0.85);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		animation: popIn 0.16s ease-out;
		box-sizing: border-box;
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid #2e2e2e;
		background: #252525;
		flex-shrink: 0;
		box-sizing: border-box;
	}

	.title-wrap {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #f0f0f0;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: #f0f0f0;
		line-height: 1.2;
	}

	.close-btn {
		background: transparent;
		border: none;
		color: #858585;
		padding: 6px;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background 0.12s,
			color 0.12s;
	}

	.close-btn:hover {
		color: #f0f0f0;
		background: #333333;
	}

	.modal-body {
		padding: 20px;
		background: #1f1f1f;
		display: flex;
		flex-direction: column;
		gap: 16px;
		box-sizing: border-box;
	}

	.connected-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		background: #262626;
		border: 1px solid #383838;
		border-radius: 6px;
		box-sizing: border-box;
	}

	.avatar-wrap {
		position: relative;
		width: 48px;
		height: 48px;
		flex-shrink: 0;
	}

	.user-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		background: #141414;
		border: 1.5px solid #3d3d3d;
		display: block;
	}

	.user-avatar.placeholder {
		background: #ed2553;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 20px;
		border: 1.5px solid #ed2553;
	}

	.status-indicator {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #4ade80;
		border: 2px solid #262626;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		flex: 1;
		overflow: hidden;
	}

	.user-name-line {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.user-name {
		font-size: 15px;
		font-weight: 600;
		color: #f0f0f0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-id {
		font-size: 11px;
		font-weight: 600;
		color: #a8a8a8;
		background: #191919;
		padding: 1px 6px;
		border-radius: 4px;
		border: 1px solid #333333;
		flex-shrink: 0;
	}

	.account-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: #858585;
		flex-wrap: wrap;
	}

	.status-text {
		color: #4ade80;
		font-weight: 550;
	}

	.dot-sep {
		color: #444444;
	}

	.key-badge {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 11px;
		color: #d9d9d9;
		background: #191919;
		padding: 1px 5px;
		border-radius: 4px;
		border: 1px solid #333333;
	}

	.tab-bar {
		display: flex;
		border-bottom: 1px solid #333333;
		gap: 8px;
	}

	.tab-btn {
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 8px 12px;
		color: #a8a8a8;
		font-size: 13px;
		font-weight: 550;
		cursor: pointer;
		margin-bottom: -1px;
		transition:
			color 0.12s,
			border-color 0.12s;
	}

	.tab-btn:hover {
		color: #f0f0f0;
	}

	.tab-btn.active {
		color: #ed2553;
		border-bottom-color: #ed2553;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.desc {
		font-size: 12.5px;
		color: #a8a8a8;
		line-height: 1.45;
		margin: 0;
	}

	.desc.notice {
		padding: 10px 12px;
		background: rgba(237, 37, 83, 0.1);
		border-left: 3px solid #ed2553;
		border-radius: 4px;
		color: #d9d9d9;
	}

	.link-help {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #ed2553;
		font-size: 12.5px;
		font-weight: 500;
		text-decoration: none;
	}

	.link-help:hover {
		text-decoration: underline;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field label {
		font-size: 12px;
		font-weight: 550;
		color: #a8a8a8;
	}

	.input {
		width: 100%;
		box-sizing: border-box;
		padding: 9px 12px;
		background: #141414;
		border: 1px solid #383838;
		border-radius: 4px;
		color: #f0f0f0;
		font-size: 13px;
	}

	.input:focus {
		outline: none;
		border-color: #ed2553;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 4px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 4px;
		font-size: 13px;
		font-weight: 550;
		cursor: pointer;
		border: 1px solid #383838;
		background: #2a2a2a;
		color: #f0f0f0;
		transition:
			background 0.12s,
			border-color 0.12s;
	}

	.btn:hover:not(:disabled) {
		background: #333333;
		border-color: #484848;
	}

	.btn-primary {
		background: #ed2553;
		border-color: #ed2553;
		color: #ffffff;
	}

	.btn-primary:hover:not(:disabled) {
		background: #ee4972;
		border-color: #ee4972;
	}

	.btn-danger {
		background: rgba(248, 113, 113, 0.08);
		border-color: #f87171;
		color: #f87171;
	}

	.btn-danger:hover:not(:disabled) {
		background: rgba(248, 113, 113, 0.18);
	}

	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.message {
		font-size: 12px;
		margin: 0;
		padding: 8px 12px;
		border-radius: 4px;
		line-height: 1.4;
		word-break: break-word;
	}

	.message.error {
		background: rgba(248, 113, 113, 0.12);
		border: 1px solid rgba(248, 113, 113, 0.35);
		color: #fca5a5;
	}

	.message.success {
		background: rgba(74, 222, 128, 0.12);
		border: 1px solid rgba(74, 222, 128, 0.35);
		color: #86efac;
	}
</style>
