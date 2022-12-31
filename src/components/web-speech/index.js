import html from './template.html';
import css from './styles.css';

const ELEMENT_IDS = ['play-pause', 'stop', 'voice', 'rate', 'pitch', 'controls'];

class WebSpeech extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${css}</style>${html}`;
    
    ELEMENT_IDS.forEach((id) => this[`_$${id.replace('-', '')}`] = this.shadowRoot.getElementById(id));

    this._synth = window.speechSynthesis;
    this._voices = [];

    this._synth.addEventListener('voiceschanged', () => {
      this._voices = this._synth.getVoices();
      this._$voice.innerHTML = this._voices
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((voice) => {
          const selected = voice.default ? ' selected' : '';
          return `<option ${selected}>${voice.name} - ${voice.lang}</option>`;
        })
        .join('');
    });

    this._$playpause.addEventListener('click', () => {
      if (this.speaking) {
        this.speaking = false;
        this._synth.pause();
      } else {
        this.speaking = true;
        if (!this.utterance) {
          this.utterance = this.target.textContent;
          this._synth.speak(this.utterance);
        } else {
          this._synth.resume();
        }
      }

      const label = this.speaking ? 'pause' : 'play';
      this._$playpause.setAttribute('aria-label', label);
    });

    this._$stop.addEventListener('click', () => {
      this.utterance = null;
      this.speaking = false;
    });

    const rateOutput = this.shadowRoot.querySelector('output[for="rate"]');
    this._$rate.addEventListener('input', () => {
      rateOutput.textContent = Number(this._$rate.value).toFixed(1);
    });

    const pitchOutput = this.shadowRoot.querySelector('output[for="pitch"]');
    this._$pitch.addEventListener('input', () => {
      pitchOutput.textContent = Number(this._$pitch.value).toFixed(1);
    });
  }

  get target() {
    if (!this._$target) {
      this._$target = document.getElementById(this.getAttribute('target'));
    }
    return this._$target;
  }

  get utterance() {
    return this._$utter;
  }

  set utterance(newValue) {
    this._synth.cancel();
    this._$utter = typeof newValue === 'string'
      ? new SpeechSynthesisUtterance(newValue)
      : newValue;

    if (this._$utter) {
      this._$controls.setAttribute('disabled', '');

      this.utterance.voice = this._voices[this._$voice.selectedIndex];
      this.utterance.rate = Number(this._$rate.value);
      this.utterance.pitch = Number(this._$pitch.value);
      this.utterance.volume = 1;
    } else {
      this._$controls.removeAttribute('disabled');
    }
  }

  get speaking() {
    return this.hasAttribute('speaking');
  }

  set speaking(newValue) {
    if (newValue) {
      this.setAttribute('speaking', '');
    } else {
      this.removeAttribute('speaking');
    }
  }
}

window.customElements.define('web-speech', WebSpeech);