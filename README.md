# WebappSpotify

Código completo del tutorial para Crear una Spotify App en Angular + Echarts.

[Parte 1]()

## Nota

Es **IMPERATIVO** tener acceso a tu propio endpoint para generar tus propias Tokens de autorización para poder usar la Spotify API, reemplazando `'...'` por tu endpoint. Puedes tomar este repositorio como punto de partida: [Spotify Web API](https://github.com/jwilsson/spotify-web-api-php/blob/main/docs/method-reference/SpotifyWebAPI.md)

```features.service.ts
/.../
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
/.../
```

![alt-text](https://github.com/postcode-x/webapp-spotify/blob/master/screenshot/final.png)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
