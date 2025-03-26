
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, X, UserPlus, Mail, Briefcase } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { TeamMember } from '@/types/project';

interface TeamMemberFormValues {
  name: string;
  email: string;
  role: string;
}

const TeamManagement: React.FC = () => {
  const { project, addTeamMember, removeTeamMember } = useProject();
  const [isAddingMember, setIsAddingMember] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<TeamMemberFormValues>({
    defaultValues: {
      name: '',
      email: '',
      role: '',
    }
  });
  
  const onSubmit = (data: TeamMemberFormValues) => {
    addTeamMember(data);
    reset();
    setIsAddingMember(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        {!isAddingMember && (
          <Button onClick={() => setIsAddingMember(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </div>
      
      {isAddingMember && (
        <Card className="glass-morphism border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Add Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    className="bg-black/30 border-white/10 pl-9"
                    placeholder="Full Name"
                    {...register('name', { required: true })}
                  />
                  <UserPlus className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="bg-black/30 border-white/10 pl-9"
                    placeholder="Email Address"
                    {...register('email', { required: true })}
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <Input
                    id="role"
                    className="bg-black/30 border-white/10 pl-9"
                    placeholder="Job Title or Role"
                    {...register('role', { required: true })}
                  />
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingMember(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Member
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {project?.members && project.members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.members.map(member => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              onRemove={removeTeamMember} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-400">No Team Members Yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            Add team members to assign tasks and collaborate.
          </p>
        </div>
      )}
    </div>
  );
};

interface TeamMemberCardProps {
  member: TeamMember;
  onRemove: (id: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onRemove }) => {
  return (
    <Card className="glass-morphism border-white/10 hover:border-white/20 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-codemate-purple to-codemate-blue flex items-center justify-center text-lg font-medium">
              {member.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={() => onRemove(member.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 text-sm text-gray-300 flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <a href={`mailto:${member.email}`} className="hover:underline">
            {member.email}
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamManagement;
