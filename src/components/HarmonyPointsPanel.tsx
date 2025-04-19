
import React from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Trophy, Star, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const HarmonyPointsPanel: React.FC = () => {
  const { currentUser } = useTurf();

  if (!currentUser) return null;

  const pointCategories = [
    {
      title: 'Quality Contributions',
      icon: Trophy,
      value: currentUser.harmonyPointEvents.filter(e => e.reason === 'quality_contribution')
        .reduce((acc, event) => acc + event.amount, 0),
      description: 'Points from well-structured arguments'
    },
    {
      title: 'Audience Reactions',
      icon: Star,
      value: currentUser.harmonyPointEvents.filter(e => e.reason === 'audience_reaction')
        .reduce((acc, event) => acc + event.amount, 0),
      description: 'Points from likes and reactions'
    },
    {
      title: 'Brain Awards',
      icon: Award,
      value: currentUser.harmonyPointEvents.filter(e => e.reason === 'brain_award')
        .reduce((acc, event) => acc + event.amount, 0),
      description: 'Points from Brain Awards'
    },
    {
      title: 'Engagement',
      icon: MessageSquare,
      value: currentUser.harmonyPointEvents.filter(e => e.reason === 'audience_engagement')
        .reduce((acc, event) => acc + event.amount, 0),
      description: 'Points from replies and discussions'
    }
  ];

  return (
    <Card className="w-full bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-primary" />
          Harmony Points
          <span className="ml-auto text-2xl font-bold text-primary">
            {currentUser.totalHarmonyPoints}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {pointCategories.map((category) => (
            <div
              key={category.title}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
            >
              <category.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{category.value}</div>
                <div className="text-sm text-muted-foreground">{category.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Recent Activity</h4>
          <ScrollArea className="h-[200px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUser.harmonyPointEvents
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {event.reason === 'quality_contribution' && 'Quality Post'}
                        {event.reason === 'audience_reaction' && 'Received Reaction'}
                        {event.reason === 'brain_award' && 'Brain Award'}
                        {event.reason === 'audience_engagement' && 'Engagement'}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        +{event.amount}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default HarmonyPointsPanel;
