/**
 * Example: Using Ponytail and Humanizer skills in Liga Manager
 * This file demonstrates how to integrate the installed skill packages
 */

import { getAvailableSkills, humanizeText, generateCodeSuggestions } from '@/utils/skills';

/**
 * Example 1: Check available skills
 */
export async function checkSkills() {
  const skills = getAvailableSkills();
  console.log('Available Skills:', JSON.stringify(skills, null, 2));
  return skills;
}

/**
 * Example 2: Generate team description using Humanizer
 * This would take AI-generated team description and make it sound natural
 */
export async function generateTeamDescription(teamName: string, aiGeneratedText: string): Promise<string> {
  console.log(`\n📝 Generating natural description for ${teamName}...`);
  
  // Use humanizer to process the AI-generated text
  const naturalDescription = await humanizeText(aiGeneratedText);
  
  return naturalDescription;
}

/**
 * Example 3: Generate code for a new feature using Ponytail
 * Demonstrates lazy senior dev mode
 */
export async function generateFeatureCode(featureDescription: string): Promise<string[]> {
  console.log(`\n⚡ Generating code suggestions for: ${featureDescription}`);
  
  const suggestions = await generateCodeSuggestions(featureDescription);
  
  if (suggestions.length > 0) {
    console.log('Code suggestions generated:');
    suggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion}`);
    });
  } else {
    console.log('No suggestions available at this time');
  }
  
  return suggestions;
}

/**
 * Example 4: League management with AI assistance
 * Combines both Ponytail and Humanizer for league operations
 */
export async function leagueOperationWithAI(operation: 'create_league' | 'update_standings' | 'generate_report') {
  const aiText = {
    create_league: "this is a new football league in the okregowa class category with multiple teams from different regions",
    update_standings: "the standings have been updated with new match results and positions have shifted based on point calculations",
    generate_report: "this week saw significant action across all groups with several teams fighting for promotion places"
  };

  console.log(`\n🏆 Processing league operation: ${operation}`);
  
  // Step 1: Check available skills
  const skills = getAvailableSkills();
  console.log('Using AI Skills:', Object.keys(skills).join(', '));
  
  // Step 2: Get natural language version using Humanizer
  const naturalText = await humanizeText(aiText[operation]);
  console.log('Humanized text:', naturalText);
  
  // Step 3: Generate code suggestions if needed
  if (operation === 'create_league') {
    const codeSuggestions = await generateCodeSuggestions('Create a new league with API endpoint');
    console.log('Generated code suggestions:', codeSuggestions);
  }
  
  return {
    operation,
    naturalDescription: naturalText,
    timestamp: new Date().toISOString()
  };
}

/**
 * Example 5: Integration with React component
 */
export const SkillsExampleComponent = () => {
  const handleCheckSkills = async () => {
    const skills = await checkSkills();
    alert(`Skills available: ${JSON.stringify(skills, null, 2)}`);
  };

  const handleGenerateTeamDesc = async () => {
    const aiText = "this team is very good at football and wins many games";
    const natural = await generateTeamDescription("GKS Pokrzywnica", aiText);
    alert(`Generated description: ${natural}`);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Skills Integration</h2>
      
      <div className="space-y-3">
        <button
          onClick={handleCheckSkills}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Check Available Skills
        </button>
        
        <button
          onClick={handleGenerateTeamDesc}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Generate Natural Team Description
        </button>
        
        <button
          onClick={() => generateFeatureCode('Add new player registration form')}
          className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Generate Feature Code
        </button>
        
        <button
          onClick={() => leagueOperationWithAI('create_league')}
          className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
        >
          League Operation with AI
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-400">
        ✓ Ponytail: Lazy senior dev mode<br/>
        ✓ Humanizer: Natural text generation
      </p>
    </div>
  );
};

// Run examples if this is the main module
if (require.main === module) {
  (async () => {
    console.log('🚀 Liga Manager - AI Skills Examples\n');
    console.log('='.repeat(50));
    
    await checkSkills();
    console.log('\n' + '='.repeat(50));
    
    await generateTeamDescription('GKS Pokrzywnica', 'this team is located in pokrzywnica and plays soccer');
    console.log('\n' + '='.repeat(50));
    
    await generateFeatureCode('Add player injury tracking system');
    console.log('\n' + '='.repeat(50));
    
    await leagueOperationWithAI('create_league');
    
    console.log('\n✨ Examples completed!');
  })();
}

export default SkillsExampleComponent;
