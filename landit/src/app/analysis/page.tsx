"use client";
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PageHeader } from '@/components/resume/PageHeader';
import { OverallScore } from '@/components/analysis/OverallScore';
import { ScoreGrid } from '@/components/analysis/ScoreGrid';
import { AnalysisSection } from '@/components/analysis/AnalysisSection';
import { ItemList } from '@/components/analysis/ItemList';
import { KeywordBadges } from '@/components/analysis/KeywordBadges';
import { SuggestionCard } from '@/components/analysis/SuggestionCard';
import { LoadingState } from '@/components/analysis/LoadState';

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  
  const analysis = useQuery(
    api.resume.getAnalysisByResumeId,
    resumeId ? { resumeId } : "skip"
  );
  
  if (!resumeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-gray-600">No resume ID provided</div>
      </div>
    );
  }

  if (!analysis) return <LoadingState />;
  
  const data = JSON.parse(analysis.analysisData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader title="Resume Analysis Results" subtitle="Detailed feedback and recommendations" />

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <OverallScore score={data.score} />
          
          <ScoreGrid scores={[
            { label: 'ATS Score', value: data.atsCompatibility.score, color: 'blue' },
            { label: 'Job Match', value: data.jobMatch.score, color: 'green' },
            { label: 'Writing', value: data.writingFormatting.score, color: 'purple' },
          ]} />
        </div>

        <div className="space-y-6">
          <AnalysisSection title="ATS Compatibility" icon="🤖" score={data.atsCompatibility.score}>
            <ItemList type="issues" title="Issues Found" items={data.atsCompatibility.issues} />
            <ItemList type="recommendations" title="Recommendations" items={data.atsCompatibility.recommendations} />
          </AnalysisSection>

          <AnalysisSection title="Job Match" icon="🎯" score={data.jobMatch.score}>
            <ItemList type="strengths" title="Strengths" items={data.jobMatch.strengths} />
            <ItemList type="gaps" title="Missing Skills" items={data.jobMatch.gaps} />
          </AnalysisSection>

          <KeywordBadges keywords={data.contentAnalysis.keywords} />
          <SuggestionCard suggestions={data.suggestions} />
        </div>
      </div>
    </div>
  );
}