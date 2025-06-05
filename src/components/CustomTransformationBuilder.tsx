import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Plus, 
  Trash2, 
  Wand2, 
  ArrowRight,
  Type,
  Split,
  Merge,
  Hash
} from 'lucide-react';

interface TransformationRule {
  id: string;
  type: 'split' | 'merge' | 'cast' | 'json_extract' | 'custom';
  name: string;
  sourceFields: string[];
  targetField: string;
  parameters: Record<string, any>;
  script?: string;
}

interface CustomTransformationBuilderProps {
  onRulesChange: (rules: TransformationRule[]) => void;
}

export const CustomTransformationBuilder: React.FC<CustomTransformationBuilderProps> = ({ 
  onRulesChange 
}) => {
  const [rules, setRules] = useState<TransformationRule[]>([]);
  const [selectedRuleType, setSelectedRuleType] = useState<string>('');
  const [newRuleName, setNewRuleName] = useState('');

  const transformationTypes = [
    { id: 'split', name: 'Split Field', icon: Split, description: 'Split a field into multiple parts' },
    { id: 'merge', name: 'Merge Fields', icon: Merge, description: 'Combine multiple fields' },
    { id: 'cast', name: 'Type Casting', icon: Type, description: 'Convert data types' },
    { id: 'json_extract', name: 'JSON Extract', icon: Hash, description: 'Extract from JSON fields' },
    { id: 'custom', name: 'Custom Script', icon: Code, description: 'Custom transformation logic' }
  ];

  const addRule = () => {
    if (!selectedRuleType || !newRuleName) return;

    const newRule: TransformationRule = {
      id: `rule_${Date.now()}`,
      type: selectedRuleType as any,
      name: newRuleName,
      sourceFields: [''],
      targetField: '',
      parameters: {},
      script: selectedRuleType === 'custom' ? '// Enter your transformation code here' : undefined
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onRulesChange(updatedRules);
    setSelectedRuleType('');
    setNewRuleName('');
  };

  const updateRule = (id: string, updates: Partial<TransformationRule>) => {
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    );
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const removeRule = (id: string) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const getParametersUI = (rule: TransformationRule) => {
    switch (rule.type) {
      case 'split':
        return (
          <div className="space-y-2">
            <Label className="text-white text-sm">Delimiter</Label>
            <Input
              placeholder="e.g., space, comma, |"
              value={rule.parameters.delimiter || ''}
              onChange={(e) => updateRule(rule.id, { 
                parameters: { ...rule.parameters, delimiter: e.target.value }
              })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        );
      case 'merge':
        return (
          <div className="space-y-2">
            <Label className="text-white text-sm">Separator</Label>
            <Input
              placeholder="e.g., space, underscore"
              value={rule.parameters.separator || ''}
              onChange={(e) => updateRule(rule.id, { 
                parameters: { ...rule.parameters, separator: e.target.value }
              })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        );
      case 'cast':
        return (
          <div className="space-y-2">
            <Label className="text-white text-sm">Target Type</Label>
            <Select 
              value={rule.parameters.targetType || ''} 
              onValueChange={(value) => updateRule(rule.id, { 
                parameters: { ...rule.parameters, targetType: value }
              })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select target type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integer">Integer</SelectItem>
                <SelectItem value="float">Float</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'json_extract':
        return (
          <div className="space-y-2">
            <Label className="text-white text-sm">JSON Path</Label>
            <Input
              placeholder="e.g., $.user.name"
              value={rule.parameters.jsonPath || ''}
              onChange={(e) => updateRule(rule.id, { 
                parameters: { ...rule.parameters, jsonPath: e.target.value }
              })}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wand2 className="h-5 w-5 mr-2" />
            Custom Transformation Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Rule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-white">Transformation Type</Label>
              <Select value={selectedRuleType} onValueChange={setSelectedRuleType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select transformation" />
                </SelectTrigger>
                <SelectContent>
                  {transformationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Rule Name</Label>
              <Input
                placeholder="Enter rule name"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <Button 
              onClick={addRule}
              disabled={!selectedRuleType || !newRuleName}
              className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>

          {/* Rule Type Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {transformationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium text-sm">{type.name}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{type.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      {rules.length > 0 && (
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Active Transformation Rules ({rules.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => {
              const ruleType = transformationTypes.find(t => t.id === rule.type);
              const Icon = ruleType?.icon || Code;
              
              return (
                <div key={rule.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">{rule.name}</h4>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {ruleType?.name}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRule(rule.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Source Field(s)</Label>
                      <Input
                        placeholder="field1, field2"
                        value={rule.sourceFields.join(', ')}
                        onChange={(e) => updateRule(rule.id, { 
                          sourceFields: e.target.value.split(',').map(f => f.trim()) 
                        })}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Target Field</Label>
                      <Input
                        placeholder="target_field"
                        value={rule.targetField}
                        onChange={(e) => updateRule(rule.id, { targetField: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>{getParametersUI(rule)}</div>
                  </div>

                  {rule.type === 'custom' && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-white text-sm">Custom Script</Label>
                      <Textarea
                        placeholder="// Enter your transformation code here"
                        value={rule.script || ''}
                        onChange={(e) => updateRule(rule.id, { script: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 font-mono"
                        rows={4}
                      />
                    </div>
                  )}

                  {/* Preview */}
                  <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono text-gray-300">
                    Preview: {rule.sourceFields.join(' + ')} <ArrowRight className="inline h-3 w-3 mx-1" /> {rule.targetField || 'output'}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
