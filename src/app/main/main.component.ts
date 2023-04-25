import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturesService } from '../services/features.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public idPattern = "^(spotify:track:(?=.{22}$)[A-Za-z0-9]*)$|^(https:\/\/[a-z]+\.spotify\.com\/track\/(?=.{22}$)[A-Za-z0-9]*)$|^(?=.{22}$)[A-Za-z0-9]*$";

  public idForm = new FormGroup({
    idInput: new FormControl('', [
      Validators.required,
      Validators.pattern(this.idPattern),
      Validators.maxLength(53),
      Validators.minLength(22)])
  });

  public tracksList : any[] = [];
  public keyLabels = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  public trackData : any = {
    artistName : 'artist',
    songName : 'song',
    songId : 'id',
    imageURL : '',
    duration_ms: 1000,
    id: "",
    key: 1,
    loudness: 0.0,
    mode: 1,
    tempo: 100.0,
    time_signature: 4,
    popularity : 0,
    danceability : 0.0,
    energy : 0.0,
    speechiness : 0.0,
    acousticness : 0.0,
    instrumentalness : 0.0,
    liveness : 0.0,
    valence : 0.0
  }

  public isLoading : boolean = false;
  public ready : boolean = false;
  public error : boolean = false;

  echartsInstance : any;
  seriesData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  seriesName = '';

  chartOption: EChartsOption = {
    legend: {
      data: [this.seriesName]
    },
    radar: {
      indicator: [
          { text: 'Danceability', max: 1},
          { text: 'Energy', max: 1},
          { text: 'Speechiness', max: 1},
          { text: 'Acousticness', max: 1},
          { text: 'Instrumentalness', max: 1},
          { text: 'Liveness', max: 1},
          { text: 'Valence', max: 1}
      ]
    },
    series: [{
      name: '',
      type: 'radar',
      data: [
          {
              value: this.seriesData,
              name: this.seriesName
          }
      ]
    }],
    tooltip:{
      trigger:"axis"
    }
  };

  constructor(private featuresService: FeaturesService, private sanitizer:DomSanitizer) {

  }

  ngOnInit(): void {
  }

  async onSubmit() {

    this.ready = false;
    this.error = false;
    const  idToTest: string = this.idForm.value.idInput ?? '';

    if (this.regexTest(idToTest)) {

      var id: string = this.idCleaner(idToTest);
      this.isLoading = true;

      const result = await (this.featuresService.queryAllTrackData(id));
      result.subscribe(

        (data: any) => {

          let plotData = data.trackFeatures;

          this.seriesData[0] = plotData.danceability;
          this.seriesData[1] = plotData.energy;
          this.seriesData[2] = plotData.speechiness;
          this.seriesData[3] = plotData.acousticness;
          this.seriesData[4] = plotData.instrumentalness;
          this.seriesData[5] = plotData.liveness;
          this.seriesData[6] = plotData.valence;

          this.seriesName = data.trackItem.name;

          this.trackData.artistName = data.trackItem.artists[0].name;
          this.trackData.songName = data.trackItem.name;
          this.trackData.songId = plotData.id;
          this.trackData.imageURL = data.trackItem.album.images[2].url;

          this.trackData.duration_ms = plotData.duration_ms;
          this.trackData.key = plotData.key;
          this.trackData.loudness = plotData.loudness;
          this.trackData.mode = plotData.mode;
          this.trackData.tempo = plotData.tempo;
          this.trackData.time_signature = plotData.time_signature;
          this.trackData.popularity = data.trackItem.popularity;

          this.trackData.danceability = plotData.danceability;
          this.trackData.energy = plotData.energy;
          this.trackData.speechiness = plotData.speechiness;
          this.trackData.acousticness = plotData.acousticness;
          this.trackData.instrumentalness = plotData.instrumentalness;
          this.trackData.liveness = plotData.liveness;
          this.trackData.valence = plotData.valence;

        }, err => {

          this.isLoading = false;
          this.error = true;

        }, () => {

          this.isLoading = false;
          this.ready = true;

        });

    }

  }

  private regexTest(idToTest: string): boolean {

    return (
      /^(spotify:track:(?=.{22}$)[A-Za-z0-9]*)$/.test(idToTest) ||
      /^(https:\/\/[a-z]+\.spotify\.com\/track\/(?=.{22}$)[A-Za-z0-9]*)$/.test(idToTest) ||
      /^(?=.{22}$)[A-Za-z0-9]*$/.test(idToTest));
  }

  private idCleaner(idToClean: string): string {

    if (/^(spotify:track:(?=.{22}$)[A-Za-z0-9]*)$/.test(idToClean) ||
      /^(https:\/\/[a-z]+\.spotify\.com\/track\/(?=.{22}$)[A-Za-z0-9]*)$/.test(idToClean)) {
      idToClean = idToClean.slice(-22);
    }

    return idToClean;
  }

  get dataUri(): SafeUrl {
    const jsonData = JSON.stringify(this.trackData);
    const uri = 'data:application/json;charset=UTF-8,' + encodeURIComponent(jsonData);
    return this.sanitizer.bypassSecurityTrustUrl(uri);
  }

  onChartInit(ec : any) {
    this.echartsInstance = ec;
  }

  resizeChart() {
      if (this.echartsInstance) {
          this.echartsInstance.resize();
      }
  }

}

