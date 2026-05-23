import * as Updates from 'expo-updates';

type UpdateCheckResult =
  | { checked: false; reason: string }
  | { checked: true; updated: boolean };

export async function checkForAppUpdate(): Promise<UpdateCheckResult> {
  if (__DEV__) {
    return { checked: false, reason: 'updates-disabled-in-development' };
  }

  if (!Updates.isEnabled) {
    return { checked: false, reason: 'updates-not-enabled' };
  }

  try {
    const update = await Updates.checkForUpdateAsync();

    if (!update.isAvailable) {
      return { checked: true, updated: false };
    }

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();

    return { checked: true, updated: true };
  } catch (error) {
    console.log('Nao foi possivel verificar atualizacoes OTA.', error);
    return { checked: false, reason: 'update-check-failed' };
  }
}
