<template>
  <div>
    <v-app>
      <v-toolbar dark color="primary">
        <!-- Toolbar content -->
        <v-btn @click="togglePlayback">{{ isPlaying ? 'Pause' : 'Play' }}</v-btn>
        <v-slider v-model="volumeLevel" min="0" max="100"></v-slider>
        <v-slider v-model="balance" min="-100" max="100"></v-slider>
      </v-toolbar>
      <div class="music-player">
        <!-- Music player content -->
        <img v-if="albumCover" :src="albumCover" alt="Album Cover">
      </div>
    </v-app>
  </div>
</template>

<script>
import { Howl, Howler } from 'howler';
import audioAnalyzer from 'audio-analyzer-library';
import Vue from 'vue';

export default {
  data() {
    return {
      songs: [], 
      currentSong: null, 
      isPlaying: false,
      volumeLevel: 50,
      balance: 0,
      albumCover: null
    };
  },
  methods: {
    togglePlayback() {
      if (this.isPlaying) {
        this.pauseSong();
      } else {
        this.playSong();
      }
    },
    playSong() {
      if (!this.currentSong) return;
      this.howl = new Howl({
        src: [this.currentSong.url], // URL of the audio file
        volume: this.volumeLevel / 100,
        stereo: this.balance / 100 // Set stereo balance
      });
      this.howl.play();
      this.isPlaying = true;
    },
    pauseSong() {
      if (this.howl) {
        this.howl.pause();
        this.isPlaying = false;
      }
    },
    fetchAlbumCover() {
      if (!this.currentSong) return;
      this.albumCover = `https://via.placeholder.com/300?text=${this.currentSong.title}`;
    },
    initGraphicEqualizer() {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioElement = document.querySelector('audio');
      audioAnalyzer(audioElement, audioContext);
    },
    scanLocalSongs() {
      const songsDirectory = '/songs';
      const files = require.context('@/assets/songs', false, /\.(mp3|wav)$/);
      const songs = files.keys().map(key => {
        const fileName = key.split('/').pop();
        return {
          title: fileName.replace(/\.[^/.]+$/, ''),
          url: files(key)
        };
      });
      localStorage.setItem('songs', JSON.stringify(songs));
      this.songs = songs;
    }
  },
  watch: {
    volumeLevel() {
      if (this.howl) {
        this.howl.volume(this.volumeLevel / 100);
      }
    },
    balance() {
      if (this.howl) {
        this.howl.stereo(this.balance / 100);
      }
    },
    currentSong() {
      this.fetchAlbumCover();
    }
  },
  mounted() {
    const storedSongs = localStorage.getItem('songs');
    if (storedSongs) {
      this.songs = JSON.parse(storedSongs);
    } else {
      this.scanLocalSongs();
    }
    this.currentSong = this.songs[0];
    this.initGraphicEqualizer();
  }
};
</script>

<style scoped>
.music-player {
  text-align: center;
}

.music-player img {
  max-width: 100%;
  max-height: 100%;
}
</style>
