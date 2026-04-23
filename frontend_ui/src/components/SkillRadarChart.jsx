import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const CATEGORIES = {
  "IT & Digital": ["sql", "python", "software", "it", "typing", "digital"],
  "Manufacturing": ["manufacturing", "production", "mechanical", "electrical", "automobile"],
  "Healthcare": ["healthcare", "medical", "nursing", "pharmacy", "biology"],
  "Agriculture": ["agriculture", "farming", "horticulture", "rural"],
  "Finance & Legal": ["finance", "accounting", "tally", "legal", "law"],
  "Media & Admin": ["media", "journalism", "admin", "management", "communication"]
};

export default function SkillRadarChart({ userSkills = [] }) {
  
  // Calculate scores for each category
  const data = Object.keys(CATEGORIES).map(category => {
    const keywords = CATEGORIES[category];
    let matches = 0;
    
    userSkills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      // Simple match check
      if (keywords.some(kw => lowerSkill.includes(kw) || kw.includes(lowerSkill))) {
        matches += 1;
      }
    });

    // Score is out of 100 based on matches (cap at 100, assuming 3 matches = 100% for this simple visual)
    const score = Math.min(Math.round((matches / 3) * 100), 100);
    
    return {
      subject: category,
      A: score || 10, // Give a small base score (10) so the radar isn't completely empty
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-64 mt-4" style={{ minHeight: '256px' }}>
      <ResponsiveContainer width="100%" height={256}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skill Match"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#818cf8' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
