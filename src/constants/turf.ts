
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
  currentPhase: "Opening Arguments" as const,
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
