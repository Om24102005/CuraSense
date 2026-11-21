import { User } from '../models/User.js';

export async function getSettings(req, res) {
  try {
    const user = await User.findById(req.user._id).select('settings');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ settings: user.settings ?? null });
  } catch (error) {
    console.error('[GET /api/user/settings] failed:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function updateSettings(req, res) {
  try {
    const { settings } = req.body || {};
    if (!settings || typeof settings !== 'object')
      return res.status(400).json({ error: 'settings object is required.' });

    const $set = {};

    if (settings.aiPreferences) {
      if (typeof settings.aiPreferences.explainLevel === 'string')
        $set['settings.aiPreferences.explainLevel'] = settings.aiPreferences.explainLevel;
      if (typeof settings.aiPreferences.outputDepth === 'string')
        $set['settings.aiPreferences.outputDepth'] = settings.aiPreferences.outputDepth;
    }

    if (Array.isArray(settings.dependents))
      $set['settings.dependents'] = settings.dependents;

    if (settings.emergencyProtocols) {
      if (Array.isArray(settings.emergencyProtocols.contacts))
        $set['settings.emergencyProtocols.contacts'] = settings.emergencyProtocols.contacts;
      if (typeof settings.emergencyProtocols.autoAlertsEnabled === 'boolean')
        $set['settings.emergencyProtocols.autoAlertsEnabled'] = settings.emergencyProtocols.autoAlertsEnabled;
    }

    if (settings.localization) {
      const loc = settings.localization;
      if (typeof loc.measurementStandard === 'string') $set['settings.localization.measurementStandard'] = loc.measurementStandard;
      if (typeof loc.language            === 'string') $set['settings.localization.language']            = loc.language;
      if (typeof loc.highContrast        === 'boolean') $set['settings.localization.highContrast']       = loc.highContrast;
      if (typeof loc.largeText           === 'boolean') $set['settings.localization.largeText']          = loc.largeText;
    }

    if (Object.keys($set).length === 0)
      return res.status(400).json({ error: 'No valid settings fields provided.' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set },
      { new: true, runValidators: false }
    ).select('settings');

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ settings: user.settings });
  } catch (error) {
    console.error('[PATCH /api/user/settings] failed:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
