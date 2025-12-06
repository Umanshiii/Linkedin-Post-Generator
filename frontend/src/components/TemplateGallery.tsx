import { X, TrendingUp, Lightbulb, Users, Award, Briefcase, Target } from 'lucide-react';

interface TemplateGalleryProps {
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
}

const templates = [
  {
    id: 1,
    title: 'Career Milestone',
    icon: Award,
    category: 'Achievement',
    content: `🎉 Excited to share a personal milestone!\n\nAfter [X months/years] of dedication and hard work, I'm thrilled to announce [your achievement].\n\nKey lessons learned along the way:\n• Consistency beats perfection\n• Community support is invaluable\n• Growth happens outside your comfort zone\n\nThank you to everyone who supported me on this journey. Here's to the next chapter! 🚀\n\n#CareerGrowth #ProfessionalDevelopment #Milestone`
  },
  {
    id: 2,
    title: 'Thought Leadership',
    icon: Lightbulb,
    category: 'Insights',
    content: `💡 A perspective on [topic] that's been on my mind...\n\nThe industry is rapidly evolving, and I believe we need to shift our thinking about [specific aspect].\n\nHere's why:\n\n1. [First reason/insight]\n2. [Second reason/insight]\n3. [Third reason/insight]\n\nWhat's your take? I'd love to hear different perspectives in the comments.\n\n#ThoughtLeadership #Innovation #FutureOfWork`
  },
  {
    id: 3,
    title: 'Team Success',
    icon: Users,
    category: 'Leadership',
    content: `🙌 Proud team moment!\n\nOur team just [accomplished something significant], and I couldn't be more proud of everyone involved.\n\nWhat made this success possible:\n✨ Clear communication\n✨ Trust and autonomy\n✨ Celebrating small wins\n\nSuccess is never a solo achievement. Thank you to my incredible team!\n\n#Teamwork #Leadership #Success`
  },
  {
    id: 4,
    title: 'Industry Insights',
    icon: TrendingUp,
    category: 'Trends',
    content: `📊 3 trends shaping [your industry] in 2025:\n\n1️⃣ [First trend]\nWhat it means: [brief explanation]\n\n2️⃣ [Second trend]\nWhy it matters: [brief explanation]\n\n3️⃣ [Third trend]\nThe opportunity: [brief explanation]\n\nAre you seeing these trends in your work? Let's discuss! 👇\n\n#IndustryTrends #Innovation #BusinessInsights`
  },
  {
    id: 5,
    title: 'Lessons Learned',
    icon: Target,
    category: 'Experience',
    content: `🎯 5 lessons from [X years] in [your field]:\n\n1. [Lesson one - keep it concise]\n2. [Lesson two - keep it concise]\n3. [Lesson three - keep it concise]\n4. [Lesson four - keep it concise]\n5. [Lesson five - keep it concise]\n\nWhich resonates most with your experience? Let me know below! 💬\n\n#CareerAdvice #ProfessionalGrowth #LessonsLearned`
  },
  {
    id: 6,
    title: 'Project Launch',
    icon: Briefcase,
    category: 'Announcement',
    content: `🚀 Excited to announce: [Project/Product Name]!\n\nAfter months of hard work, we're finally launching [brief description].\n\nWhat makes it special:\n→ [Key feature/benefit 1]\n→ [Key feature/benefit 2]\n→ [Key feature/benefit 3]\n\nThis wouldn't be possible without our amazing team and supporters. Thank you! 🙏\n\nCheck it out and let me know what you think: [Link]\n\n#ProductLaunch #Innovation #Entrepreneurship`
  }
];

export function TemplateGallery({ onClose, onSelectTemplate }: TemplateGalleryProps) {
  const handleSelectTemplate = (template: string) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Post Templates</h2>
            <p className="text-gray-600 text-sm">Choose a template to get started quickly</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.content)}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 text-left hover:border-blue-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{template.title}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {template.content}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
