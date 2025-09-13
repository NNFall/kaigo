import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  title: string;
  category: string;
  description: string;
  results: string[];
  tags: string[];
  image: string;
  fullDescription?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectModal = ({ project, open, onOpenChange }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{project.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-digital-primary/20 text-digital-primary">
              {project.category}
            </Badge>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-digital-secondary/30">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Key Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-digital-primary">Ключевые результаты:</h3>
            <ul className="space-y-2">
              {project.results.map((result, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-digital-primary mt-1">•</span>
                  {result}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          {project.technologies && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-digital-primary">Технологии:</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="border-digital-accent/30">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {project.liveUrl && (
              <Button 
                asChild 
                className="bg-digital-primary hover:bg-digital-primary/90"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Посмотреть проект
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};