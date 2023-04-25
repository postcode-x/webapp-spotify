import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { TrackFeatures, TracksItem } from '../models/search';
import * as base64 from 'base64-js';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(private http: HttpClient) { }

  public async queryAllTrackData(id: string) : Promise<Observable<any>> {

    const token = await this.getToken();

    var headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return forkJoin({
      trackItem: this.http.get<TracksItem>(`https://api.spotify.com/v1/tracks/${id}`, { headers }),
      trackFeatures: this.http.get<TrackFeatures>(`https://api.spotify.com/v1/audio-features/${id}`, { headers })
    });

  }

  private async getToken() : Promise<string> {

    const client_id = environment.apiClient;
    const client_secret = environment.apiSecret;
    const encoder = new TextEncoder();
    const data = encoder.encode(client_id + ':' + client_secret);
    const base64Encoded = base64.fromByteArray(data);

    const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : `Basic ${base64Encoded}`
          },
          body: new URLSearchParams({
            'grant_type': 'client_credentials'
          }),
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const output = await response.json();
    return output.access_token;

  }

}

