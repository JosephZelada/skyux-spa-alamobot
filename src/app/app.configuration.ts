import { Injectable } from '@angular/core';
import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

@Injectable()
export class Configuration {

  public readonly alamobotApiUrl: string;

  constructor(skyAppConfig: SkyAppConfig) {
    this.alamobotApiUrl = skyAppConfig.skyux.appSettings.alamobotApiUrl;
  }
}
