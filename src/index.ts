import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the jupyterlab-cpg-portal-files extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-cpg-portal-files:plugin',
  description: 'Access files on the CPG Portal',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension jupyterlab-cpg-portal-files is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterlab-cpg-portal-files settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupyterlab-cpg-portal-files.', reason);
        });
    }
  }
};

export default plugin;
