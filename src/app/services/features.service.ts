import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { TokenInterface, TrackFeatures, TracksItem } from '../models/search';


@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(private http: HttpClient) { }

  public queryAllTrackData(id: string): Observable<any> {

    return this.http.get<TokenInterface>('...').pipe(

      concatMap((result) => {

        var headers = new HttpHeaders({
          'Authorization': 'Bearer ' + result.accessToken
        });

        return forkJoin({
          trackItem: this.http.get<TracksItem>(`https://api.spotify.com/v1/tracks/${id}`, { headers }),
          trackFeatures: this.http.get<TrackFeatures>(`https://api.spotify.com/v1/audio-features/${id}`, { headers })
        });

      })

    );

  }

}
