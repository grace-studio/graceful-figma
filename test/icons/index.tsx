import dynamic from 'next/dynamic';

const Icons = {
  ExternalLink: dynamic(() => import('./icons/ExternalLink')),
  Trash: dynamic(() => import('./icons/Trash'))
};

export default Icons;

