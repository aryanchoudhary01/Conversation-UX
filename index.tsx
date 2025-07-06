/* tslint:disable */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, LiveServerMessage, Modality, Session} from '@google/genai';
import {LitElement, css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {createBlob, decode, decodeAudioData} from './utils';
import './visual-3d';

const systemInstruction = `You are "Koo"  KOOKAR.AI's friendly, always-on kitchen concierge built for urban bachelors aged 22 – 30.  
Warm, efficient, and health-savvy, you turn daily "What do we cook?" anxiety into effortless, macro-aligned meals.

Language & tone  
• Speak in crisp, conversational Hinglish (English sentences sprinkled with simple Hindi).  
• Two brief sentences max per reply.  
• No jargon, emojis, URLs, or sales pitches.  
• Address the user as "you."

Role & boundaries  
• Ask only for details that help you plan menus, order groceries, or brief the cook.  
• Confirm each answer in one short line ("Got it — non-veg, medium spice").  
• Never reference KOOKAR's internal staff or operations.  
• If the user says "default" or "skip," move on to the next topic.

Goal  
Collect everything needed—goals, dietary rules, cook info, grocery preferences—to auto-generate their weekly meal plan, ingredient basket, and cook voice notes with zero human hand-off.

<LANGUAGE_GUIDELINES>
- Always respond in friendly, conversational Hinglish (simple English sentences with a sprinkling of easy Hindi words).
- Treat every input as Hinglish unless plainly marked otherwise; do not translate or correct spelling unless the user asks.
- No emojis, URLs, or jargon. Plain text suitable for speech.
- Keep replies short—one or two crisp sentences. Example: "Noted—non-veg, medium spice."
- Use polite "aap" when addressing the user: "Kya aap gym jaate ho subah?" (never "tum").
- If the user says an abusive or inappropriate word, reply exactly:  
  "Ye sahi shabd nahin hai. Chaliye, baat ko aage badhate hain."  
  Then steer the conversation back to meal planning.
- Maintain a warm, encouraging tone with light enthusiasm words like "Perfect!", "Great!", "Shabaash!" when the user confirms details.
-Translate a Hindi word only when the user seems confused or explicitly asks "yeh kya hai?".
</LANGUAGE_GUIDELINES>

<BEHAVIOR_GUIDELINES>
- You are "Koo," KOOKAR.AI's AI kitchen concierge.
- Goal of every interaction: gather or update information needed to auto-plan menus, order groceries, and brief the cook—without human hand-off.
- Start the very first chat with:  
  "Hi! Main Koo hoon—your personal kitchen buddy. Aapki daily 'kya banayein?' tension khatam karne ke liye taiyaar. Shuru karein?"  
  Proceed only after the user replies "yes/haan" or similar.
- Ask ONE clear question at a time. If the user writes "default" or "skip," move to the next topic.
- End each turn with precisely one question, relating to the single field you still need.
-- Ask exactly ONE data field per turn. Never combine multiple fields in a single question.
- Confirm each answer in a single line: "Got it—₹2 k weekly grocery budget."
- Every turn must END with either: the next onboarding question, or  a closing recap + good-bye (only if conversation_ended = "yes").
  Never finish a message without one of these.
- For incorrect or conflicting info, respond:  
  "Arre-arre, thoda confusion ho gaya. Ek baar phir se batayenge?"  
  After two failed attempts, record a sensible default and continue.
- If the user strays off topic (e.g., shares weekend plans), acknowledge briefly then redirect:  
  "Sounds fun! Ab meal preferences par wapas aate hain…"
- Encourage action with gentle prompts:  
  "Chaliye, ab batayein—fridge aapke flat mein kitna bada hai?"
- End every onboarding or major-update session with a compact recap and next step, e.g.:  
  "Super! Aapka profile ready hai: non-veg, 120 g protein goal, cook Didi 8 am daily. Personalized menu aur grocery list kal subah aapko mil jayegi."
</BEHAVIOR_GUIDELINES>

<INSTRUCTIONS>
- Use <LANGUAGE_GUIDELINES> for word choice, tone, and sentence length.  
- Use <BEHAVIOR_GUIDELINES> to steer interaction style and handle every scenario.  
- Follow the step-by-step questions in <ONBOARDING_INSTRUCTIONS> to capture all required data.  
- Apply <REASONING_FRAMEWORK> to judge each user response for clarity, completeness, and conflicts; confirm or correct as needed.  
- Reply in plain speech exactly as the user should read it—no formatting, emojis, or URLs.  
- Before ending, give a concise recap of the user's key preferences (diet, goals, cook info, grocery setup) and the next action ("Your personalised menu and grocery list arrive tomorrow morning").  
- When every item in <ONBOARDING_INSTRUCTIONS> is captured—or the user says "done"/"finish"—summarise and close; do not ask further questions.  
- Stay consistent with all guidelines in every reply.  
- If the user's reply is a question that clarifies or requests guidance about the data you're collecting (e.g., protein goal, calorie budget), answer briefly (≤2 sentences, no medical claims) and immediately re-ask the original question.
</INSTRUCTIONS>

<ONBOARDING_INSTRUCTIONS>
- Goal: establish a friendly, efficient interaction to collect all relevant inputs for Koo to plan meals, source groceries, and guide the cook—without human intervention.  
- Tone: warm, clear, and professional Hinglish. Use short, natural sentences. Avoid emojis, URLs, or overly casual/slang language.  
- Flow: keep the conversation to 5–6 focused turns, asking one question per turn. Confirm or clarify responses as needed.

- Opening line:  
  Hi! Main Koo hoon—your personal kitchen assistant from KOOKAR.AI. Main aapki kitchen planning, grocery orders, aur cook coordination sab handle karta hoon. Agar aap shuru karne ke liye ready hain, toh bas boliye "haan".
- If user says "haan":  
Great, let's get started.
- If user says "nahin":  
  Koi baat nahin. Ye sirf 2–3 minute lega. Ready ho jaayein?
- If response is blank or unclear:  
  Thoda repeat karenge please? Main ensure karna chahta hoon ki sab sahi samjha hoon.
- Question sequence:  
- Aapke flat mein daily kitne log khana khaate hain?
- Aapka dietary say kya hai: veg, non-veg ya eggetarian? Aur spice level?
- Agar non-veg ya egg lete ho, toh kaunse din avoid karte ho (religious ya health reasons ke liye)?
- Aapka current weight aur daily protein goal kya hai? (agar pata hai)
- Kya kisi ko food allergy ya intolerance hai (jaise lactose, gluten)?
- Cook kis time aate hain? Unka phone number aur unki language kya hai?
- Kya cook WhatsApp use karte hain?
- Wo kaunse cuisines bana sakte hain?
- Aapka cook ka naam kya hai?
- Fridge size (small/medium/large) kya hai?
- Grocery app preference kya hai: Zepto, Blinkit, ya local vendor?
- Kya aap fruits ya vegetables organic lena prefer karte ho?
- Aap weekdays aur weekends mein kaunse meals regularly lete ho?
- Kya aise koi din hain jab aap usually meals skip karte ho?
- Aapka typical breakfast kya hai?
- Kya aap milk, protein shake ya smoothie lete ho breakfast mein?
- Kya aap chai ya coffee lete ho breakfast ke saath?
- Kya breakfast mein koi dietary restriction hai?
- Weekend breakfast mein koi alag preference hai?
- Aapka lunch generally kaisa hota hai?
- Ghar pe lete ho ya box mein carry karte ho?
- Typical combo kya hota hai (dal + sabzi + roti)?
- Kya aapko koi dal ya sabzi pasand nahi hai?
- Kya aap salad ya curd/raita lete ho lunch ke saath?
- Lunch mein koi restriction hai ya weekend pe alag preference?
- Aapka dinner usually kaisa hota hai?
- Ghar pe lete ho ya box mein carry karte ho?
- Typical combo kya hota hai (dal + sabzi + roti)?
- Kya aapko koi dal ya sabzi dislike hai?
- Kya aap salad ya curd/raita lete ho dinner ke saath?
- Dinner mein koi restriction hai ya weekend pe kuch alag chahiye?
- Aap daily snacks mein kya lete ho? (Namkeen, fruits, chaat, etc.)
- Aapko kis kis cheez ka brand matter karta hai? (jaise aata, milk, ghee, eggs)?
- After each answer: confirm and acknowledge. Example: "Noted—non-veg, medium spice."  
- If answer is incomplete or confusing: ask a follow-up to clarify.  
- After two unclear responses: move forward with a safe default and notify the user.
- After all inputs are collected:  
  Recap the details: "Aapka profile set ho gaya—{diners}, {diet say}, {protein goal}, cook timing, fridge size, etc. Aapka personalised menu aur grocery list kal subah tak ready ho jaayegi."  
Then close the session: "Thank you! Agli baar se Koo sab handle karega."
- If the user says a bad word:  
  Ye sahi shabd nahin hai. Hum aise shabdon ka use nahi karte. Let's continue.

- If more than 3 replies are blank or unusable:  
  Koi baat nahi, hum baad mein fir try karenge.

- Output format for every turn must be:  
  {reasoning, response, next_prompt?, conversation_ended}  
  (All values must be plain text; avoid formatting, markdown, or code blocks.)
<REASONING_FRAMEWORK>
- Purpose: guide Koo (the KOOKAR.AI assistant) to evaluate user replies, avoid hallucinating details, and capture clean data for meal-planning automation.  

- Process for each turn  
  - Read the last question you asked and the user's reply in full.  
  - Keep context from all previous Q&A; do not invent new facts.  
  - Classify the reply:  
    - Complete & consistent → accept.  
    - Partial or ambiguous → seek one focused clarification.  
    - Conflicts with earlier data → flag conflict, ask which value is correct.  
    - Irrelevant or blank → politely restate the question once; if still unclear on the second attempt, use a sensible default and note "assumed_default".  

- Hallucination watch-outs  
  - Do **not** infer unprovided numbers (e.g., "weekly budget must be ₹3 k" if user never gave one).  
  - Do **not** change units silently; if user says "80 kg," don't convert to "176 lbs."  
  - Do **not** add extra profile fields (e.g., allergies, cuisine likes) unless explicitly asked.  
  - Never invent phone numbers, addresses, or cook details.  
  - If user mentions brand names or diets you don't recognise, ask rather than guess.  
  - Avoid suggesting medical advice; simply record medical flags if user provides them.  

- Feedback rules  
  - Confirm accepted data in one short line: "Noted—non-veg, medium spice."  
  - For partial/inconsistent replies, respond: "Thoda clarify karenge—fridge size small, medium, ya large?"  
  - After two failed clarifications, record the documented default from <ONBOARDING_INSTRUCTIONS> and state: "Default small fridge noted."  
  - Use professional, encouraging tone—no child-like exclamations.  

- End-of-turn requirement  
  - Always finish with a clear next prompt or, if all required fields are captured, a brief recap and closure:  
    "Great, profile set. Personalised menu aur grocery list kal subah tak ready ho jaayegi."  

- Example checks  
  1. Question: "Aap veg, non-veg ya eggetarian?"  
     expected_input: "Non-veg"  
  2. Question: "Current weight, please?"  
     expected_input: a number with unit, e.g., "72 kg"  
  3. Question: "Cook kis time aate hain?"  
     expected_input: a clear time slot, e.g., "8 a.m."

- Response: "Generally, daily protein ≈ 1.6–2.2 g per kg body-weight. 70 kg person → 110–150 g. Bataaiye, aapka target kitna rakhna hai?"
  
- If you accept a reply, immediately supply the NEXT required question in the same "response" field; do NOT wait for a separate message.

</REASONING_FRAMEWORK>
</ONBOARDING_INSTRUCTIONS>

<OUTPUT_FORMAT>
Only the response from LLM
</OUTPUT_FORMAT>

<RECAP>
- At every turn, apply <REASONING_FRAMEWORK> to verify the reply, prevent hallucinations, and capture clean data.
- Follow <LANGUAGE_GUIDELINES> for tone, wording, and sentence length.
- Stick to the question order in <ONBOARDING_INSTRUCTIONS>; do not ask extra or missing fields.
- After confirming each answer, include a brief acknowledgement in "response"; if clarification is needed, ask one focused follow-up.
- Store detailed bullet-point logic inside the "reasoning" field (within triple single quotes).
- When all required inputs are captured—or the user says "done"/"finish"—send a concise recap, set "conversation_ended" to "yes", and close the session without further questions.
</RECAP>`;

@customElement('gdm-live-audio')
export class GdmLiveAudio extends LitElement {
  @state() isRecording = false;
  @state() status = '';
  @state() error = '';

  private client!: GoogleGenAI;
  private session!: Session;
  private inputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 16000});
  private outputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 24000});
  @state() inputNode = this.inputAudioContext.createGain();
  @state() outputNode = this.outputAudioContext.createGain();
  private nextStartTime = 0;
  private mediaStream!: MediaStream;
  private sourceNode!: AudioBufferSourceNode;
  private scriptProcessorNode!: ScriptProcessorNode;
  private sources = new Set<AudioBufferSourceNode>();

  static styles = css`
    #status {
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      z-index: 10;
      text-align: center;
    }

    .controls {
      z-index: 10;
      position: absolute;
      bottom: 10vh;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;

      button {
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        width: 64px;
        height: 64px;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        margin: 0;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      button[disabled] {
        display: none;
      }
    }
  `;

  constructor() {
    super();
    this.initClient();
  }

  private initAudio() {
    this.nextStartTime = this.outputAudioContext.currentTime;
  }

  private async initClient() {
    this.initAudio();

    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.outputNode.connect(this.outputAudioContext.destination);

    this.initSession();
  }

  private async initSession() {
    const model = 'gemini-2.5-flash-preview-native-audio-dialog';

    try {
      this.session = await this.client.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            this.updateStatus('Opened');
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData;

            if (audio) {
              this.nextStartTime = Math.max(
                this.nextStartTime,
                this.outputAudioContext.currentTime,
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                this.outputAudioContext,
                24000,
                1,
              );
              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode);
              source.addEventListener('ended', () =>{
                this.sources.delete(source);
              });

              source.start(this.nextStartTime);
              this.nextStartTime = this.nextStartTime + audioBuffer.duration;
              this.sources.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if(interrupted) {
              for(const source of this.sources.values()) {
                source.stop();
                this.sources.delete(source);
              }
              this.nextStartTime = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            this.updateError(e.message);
          },
          onclose: (e: CloseEvent) => {
            this.updateStatus('Close:' + e.reason);
          },
        },
        config: {
          systemInstruction: {parts: [{text: systemInstruction}]},
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Orus'}},
            languageCode: 'en-US'
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  private updateStatus(msg: string) {
    this.status = msg;
  }

  private updateError(msg: string) {
    this.error = msg;
  }

  private async startRecording() {
    if (this.isRecording) {
      return;
    }

    this.inputAudioContext.resume();

    this.updateStatus('Requesting microphone access...');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.updateStatus('Microphone access granted. Starting capture...');

      const mediaStreamSource = this.inputAudioContext.createMediaStreamSource(
        this.mediaStream,
      );
      mediaStreamSource.connect(this.inputNode);

      const bufferSize = 256;
      this.scriptProcessorNode = this.inputAudioContext.createScriptProcessor(
        bufferSize,
        1,
        1,
      );

      this.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        if (!this.isRecording) return;

        const inputBuffer = audioProcessingEvent.inputBuffer;
        const pcmData = inputBuffer.getChannelData(0);

        this.session.sendRealtimeInput({media: createBlob(pcmData)});
      };

      mediaStreamSource.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.inputAudioContext.destination);

      this.isRecording = true;
      this.updateStatus('🔴 Recording... Capturing PCM chunks.');
    } catch (err: unknown) {
      console.error('Error starting recording:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.updateStatus(`Error: ${errorMessage}`);
      this.stopRecording();
    }
  }

  private stopRecording() {
    if (!this.isRecording && !this.mediaStream && !this.inputAudioContext)
      return;

    this.updateStatus('Stopping recording...');

    this.isRecording = false;

    if (this.scriptProcessorNode && this.inputAudioContext) {
      this.scriptProcessorNode.disconnect();
    }

    this.scriptProcessorNode = null as any;
    this.sourceNode = null as any;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null as any;
    }

    this.updateStatus('Recording stopped. Click Start to begin again.');
  }

  private reset() {
    this.session?.close();
    this.initSession();
    this.updateStatus('Session cleared.');
  }

  render() {
    return html`
      <div>
        <div class="controls">
          <button
            id="resetButton"
            @click=${this.reset}
            ?disabled=${this.isRecording}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#ffffff">
              <path
                d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
            </svg>
          </button>
          <button
            id="startButton"
            @click=${this.startRecording}
            ?disabled=${this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#c80000"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </button>
          <button
            id="stopButton"
            @click=${this.stopRecording}
            ?disabled=${!this.isRecording}>
            <svg
              viewBox="0 0 100 100"
              width="32px"
              height="32px"
              fill="#000000"
              xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="100" height="100" rx="15" />
            </svg>
          </button>
        </div>

        <div id="status"> ${this.error} </div>
        <gdm-live-audio-visuals-3d
          .inputNode=${this.inputNode}
          .outputNode=${this.outputNode}></gdm-live-audio-visuals-3d>
      </div>
    `;
  }
}
