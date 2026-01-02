
import { Mood } from './types';

export const MOOD_POOL: Mood[] = [
  { emoji: '🙂', label: 'Peaceful' },
  { emoji: '😶', label: 'Neutral' },
  { emoji: '😔', label: 'Melancholy' },
  { emoji: '😡', label: 'Frustrated' },
  { emoji: '🥱', label: 'Exhausted' },
  { emoji: '✨', label: 'Inspired' },
  { emoji: '🌱', label: 'Growing' },
  { emoji: '🌊', label: 'Deep' },
  { emoji: '🕯️', label: 'Reflective' },
  { emoji: '☁️', label: 'Drifting' },
  { emoji: '🍂', label: 'Lonely' },
  { emoji: '🏮', label: 'Warm' },
  { emoji: '🏔️', label: 'Solid' },
  { emoji: '🦋', label: 'Free' },
  { emoji: '🌘', label: 'Quiet' },
  { emoji: '🌵', label: 'Resilient' },
  { emoji: '🌪️', label: 'Chaotic' },
  { emoji: '🍒', label: 'Sweet' },
  { emoji: '🧊', label: 'Cold' },
  { emoji: '🏹', label: 'Focused' },
  { emoji: '🪴', label: 'Settled' },
  { emoji: '🌫️', label: 'Hazy' },
  { emoji: '🎻', label: 'Elegant' },
  { emoji: '🪁', label: 'Light' },
  { emoji: '🐚', label: 'Soft' },
  { emoji: '🌋', label: 'Intense' },
  { emoji: '🛰️', label: 'Remote' },
  { emoji: '🎡', label: 'Nostalgic' },
  { emoji: '🛤️', label: 'Endless' },
  { emoji: '⛲', label: 'Flowing' }
];

export const SYSTEM_PROMPT = `你是一位高效的世界文学档案员。
任务：根据给出的日期和心情Emoji，提供一条真实、优美的文学引文。

规则：
1. 真实性：严禁编造引文。
2. 长度：每行文字严禁超过20个汉字，长句需换行。
3. 署名：最后一行必须包含作者（格式：\n——作者名）。
4. 风格：内容应与Emoji所表达的情绪高度契合。
5. 简洁：直接输出引文和署名，不解释。`;
