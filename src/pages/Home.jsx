import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { Hero } from '../components/home/Hero';
import { StoriesSection } from '../components/home/StoriesSection';
import { LatestProjectsSection } from '../components/home/LatestProjectsSection';
import { SelectedProjects } from '../components/home/SelectedProjects';
import { WhatWeDoSection } from '../components/home/WhatWeDoSection';
import { ProductsSection } from '../components/home/ProductsSection';
import { StatsSection } from '../components/home/StatsSection';
import { TeamSection } from '../components/home/TeamSection';
import { JoinTeamBlocksSection } from '../components/home/JoinTeamBlocksSection';
import { ClientsSection } from '../components/home/ClientsSection';
import { CtaSection } from '../components/home/CtaSection';
import { InlineContactSection } from '../components/home/InlineContactSection';

import { ShowreelModal } from '../components/home/ShowreelModal';
import { StoryViewerModal } from '../components/home/StoryViewerModal';
import { ProjectModal } from '../components/home/ProjectModal';
import { ContactModal } from '../components/home/ContactModal';

import { STORIES_DATA, SELECTED_PROJECTS } from '../content/home/saberData';
import { useTranslation } from '../i18n/hooks/useTranslation';

const Home = () => {
  const navigate = useNavigate();
  const { isArabic } = useTranslation();

  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSelectStory = (story) => {
    setSelectedStory(story);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleSelectProjectById = (projectId) => {
    const proj = SELECTED_PROJECTS.find((p) => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  const handleViewAllStories = () => {
    if (STORIES_DATA.length > 0) {
      setSelectedStory(STORIES_DATA[0]);
    }
  };

  const handleViewAllProjects = () => {
    const el = document.getElementById('portfolio') || document.getElementById('our-work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinTeam = () => navigate('/join-us');

  const handleOpenApply = () => navigate('/join-us');

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="pt-24 min-h-screen bg-[#f8f9fa] text-[#111315] selection:bg-[#E5192D] selection:text-white"
      style={{
        fontFamily: isArabic
          ? "'Cairo', system-ui, sans-serif"
          : "'Montserrat', system-ui, sans-serif",
      }}
    >
      <Helmet>
        {!isArabic && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          />
        )}
        {isArabic && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
          />
        )}
      </Helmet>

      <Hero
        onOpenShowreel={() => setIsShowreelOpen(true)}
        onSelectProject={handleSelectProjectById}
      />

      <StoriesSection
        onSelectStory={handleSelectStory}
        onViewAllStories={handleViewAllStories}
      />

      <LatestProjectsSection onSelectProject={handleSelectProject} />

      <SelectedProjects
        onSelectProject={handleSelectProject}
        onViewAllProjects={handleViewAllProjects}
      />

      <WhatWeDoSection onLearnMore={() => setIsContactOpen(true)} />

      <ProductsSection onOpenContact={() => setIsContactOpen(true)} />

      <StatsSection />

      <TeamSection onJoinTeam={handleJoinTeam} />

      <JoinTeamBlocksSection onOpenApply={handleOpenApply} />

      <ClientsSection />

      <CtaSection onOpenContact={() => setIsContactOpen(true)} />

      <InlineContactSection />

      <ShowreelModal isOpen={isShowreelOpen} onClose={() => setIsShowreelOpen(false)} />

      <StoryViewerModal
        key={selectedStory ? selectedStory.id : 'story-viewer-closed'}
        initialStory={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={() => {
          setSelectedProject(null);
          setIsContactOpen(true);
        }}
      />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};

export default Home;
