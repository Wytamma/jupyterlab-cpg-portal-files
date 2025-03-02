// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ToolbarButton } from '@jupyterlab/apputils';

import { FileBrowser } from '@jupyterlab/filebrowser';

import { launchIcon, refreshIcon } from '@jupyterlab/ui-components';

import { PanelLayout, Widget } from '@lumino/widgets';

import { CPGPortalDrive } from './contents';

/**
 * Widget for hosting the GitLab filebrowser.
 */
export class CPGPortalFileBrowser extends Widget {
  constructor(browser: FileBrowser, drive: CPGPortalDrive) {
    super();
    this.addClass('jp-CPGPortalBrowser');
    this.layout = new PanelLayout();
    (this.layout as PanelLayout).addWidget(browser);
    this._browser = browser;
    this._drive = drive;

    // Create a button that opens GitLab at the appropriate
    // repo+directory.
    this._openCPGPortalButton = new ToolbarButton({
      icon: launchIcon,
      tooltip: 'Link to CPG Portal',
      onClick: async () => {
        window.open('https://portal.cpg.unimelb.edu.au/files', '_blank');
      }
    });
    this._openCPGPortalButton.addClass('jp-GitLab-toolbar-item');
    this._browser.toolbar.addItem('CPGPortal', this._openCPGPortalButton);

    // Add our own refresh button, since the other one is hidden
    // via CSS.
    const refresher = new ToolbarButton({
      icon: refreshIcon,
      onClick: () => {
        this._browser.model.refresh();
      },
      tooltip: 'Refresh File List'
    });
    refresher.addClass('jp-GitLab-toolbar-item');
    this._browser.toolbar.addItem('gh-refresher', refresher);
    this._drive.errorState.changed.connect(this._updateErrorPanel, this);
  }

  /**
   * React to a change in the validity of the drive.
   */
  private _updateErrorPanel(): void {
    const validToken = this._drive.validToken;

    // If we currently have an error panel, remove it.
    if (this._errorPanel) {
      const listing = (this._browser.layout as PanelLayout).widgets[1];
      listing.node.removeChild(this._errorPanel.node);
      this._errorPanel.dispose();
      this._errorPanel = null;
    }

    // If we have an invalid token, make an error panel.
    if (!validToken) {
      this._errorPanel = new CPGPortalErrorPanel('Invalid access token');
      const listing = (this._browser.layout as PanelLayout).widgets[1];
      listing.node.appendChild(this._errorPanel.node);
      return;
    }
  }

  private _browser: FileBrowser;
  private _drive: CPGPortalDrive;
  private _errorPanel: CPGPortalErrorPanel | null = null;
  private _openCPGPortalButton: ToolbarButton;
}

/**
 * A widget hosting an error panel for the browser,
 * used if there is an invalid user name or if we
 * are being rate-limited.
 */
export class CPGPortalErrorPanel extends Widget {
  constructor(message: string) {
    super();
    this.addClass('jp-GitLabErrorPanel');
    const image = document.createElement('div');
    const text = document.createElement('div');
    image.className = 'jp-GitLabErrorImage';
    text.className = 'jp-GitLabErrorText';
    text.textContent = message;
    this.node.appendChild(image);
    this.node.appendChild(text);
  }
}
