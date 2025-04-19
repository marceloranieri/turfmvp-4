
import { DebatePhase, Message } from '../types/turf';

export const AI_NOTIFICATION_LINES = [
  "Wiz just tossed a thought grenade.",
  "The Wizard has entered the chat.",
  "Wizard of Mods just pulled a mic drop.",
  "Wiz is stirring the pot.",
  "The Wizard challenges your thinking.",
  "Perspective shift, courtesy of Wiz.",
  "The Wizard spices up the debate.",
  "Wiz just played devil's advocate.",
  "Wizard alert: new angle detected.",
  "The Wizard asks what if..."
];

export const MOCK_CURRENT_USER = {
  id: "user-1",
  username: "YourUsername",
  avatarUrl: "https://i.pravatar.cc/150?u=user-1",
  harmonyPoints: 42,
  brainAwardsGiven: 0,
  brainAwardsReceived: 2
};

export const INITIAL_TOPIC = {
  id: "topic-1",
  title: "Is remote work here to stay post-pandemic?",
  description: "Discuss the long-term viability of remote work arrangements and their impact on productivity, well-being, and organizational culture.",
  currentPhase: DebatePhase.OPENING_ARGUMENTS,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

export const AI_MESSAGES = [
  "Have you considered the impact of remote work on company culture? Some studies suggest it can lead to isolation and disconnection. [Source: https://example.com/remote-work-culture]",
  "Remote work may increase productivity for some, but decrease it for others - personality factors play a key role in determining who thrives remotely. [Source: https://example.com/remote-productivity]",
  "What about accessibility? Remote work opens opportunities for people with mobility challenges but may create barriers for those with limited home technology. [Source: https://example.com/remote-accessibility]",
  "Environmental impact is worth considering - less commuting means reduced carbon emissions, but what about increased home energy usage? [Source: https://example.com/remote-environment]",
  "Remote work could reshape urban centers. If knowledge workers leave cities, how might that affect local economies and housing markets? [Source: https://example.com/remote-urban-impact]"
];

// Add the missing INITIAL_MESSAGES constant
export const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-1",
    userId: "user-2",
    username: "DebateEnthusiast",
    avatarUrl: "https://i.pravatar.cc/150?u=user-2",
    content: "Remote work has dramatically improved my work-life balance. I save 2 hours commuting each day!",
    parentId: undefined,
    linkTo: undefined,
    isAi: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    reactions: [],
    upvotes: 5,
    downvotes: 1,
    tags: ["Opening Argument"],
    brainAwards: 1
  },
  {
    id: "msg-2",
    userId: "user-3",
    username: "WorkplaceStrategist",
    avatarUrl: "https://i.pravatar.cc/150?u=user-3",
    content: "While remote work offers flexibility, I've noticed a decline in spontaneous collaboration that used to happen in the office.",
    parentId: undefined,
    linkTo: undefined,
    isAi: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reactions: [],
    upvotes: 3,
    downvotes: 0,
    tags: ["Opening Argument"],
    brainAwards: 0
  },
  {
    id: "msg-3",
    userId: "user-4",
    username: "FutureOfWork",
    avatarUrl: "https://i.pravatar.cc/150?u=user-4",
    content: "I think hybrid models will dominate. Companies won't abandon offices entirely, but flexibility will be key.",
    parentId: undefined,
    linkTo: undefined,
    isAi: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    reactions: [],
    upvotes: 7,
    downvotes: 2,
    tags: ["Opening Argument"],
    brainAwards: 2
  },
  {
    id: "msg-4",
    userId: "ai-wizard",
    username: "Wizard of Mods",
    avatarUrl: "/wizard.png",
    content: "Research shows that remote workers are 13% more productive but report 50% more feelings of isolation. Have you experienced both sides of this coin? [Source: Stanford Remote Work Study, 2022]",
    parentId: undefined,
    linkTo: undefined,
    isAi: true,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    reactions: [],
    upvotes: 0,
    downvotes: 0,
    tags: ["Valid Question"],
    brainAwards: 0
  }
];

