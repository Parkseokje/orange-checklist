export default {
  items: [
    // {
    //   name: '대시보드',
    //   url: '/dashboard',
    //   icon: 'icon-speedometer',
    //   roles: ['admin']
    // },
    {
      name: '점포관리',
      url: '/shop',
      icon: 'icon-puzzle',
      roles: ['admin']
    },
    {
      name: '사용자관리',
      url: '/user',
      icon: 'icon-puzzle',
      roles: ['admin']
    },
    {
      name: '체크리스트 관리',
      url: '/checklist',
      icon: 'icon-puzzle',
      roles: ['admin', 'supervisor', 'agent']
    },
    {
      name: '나의 체크리스트',
      url: '/user-checklist',
      icon: 'icon-puzzle',
      roles: 'all'
    },
    {
      name: '게시판 관리',
      url: '/board',
      icon: 'icon-puzzle',
      roles: ['admin']
    },
    {
      name: '나의 게시판',
      url: '/user-board',
      icon: 'icon-puzzle',
      roles: 'all'
    },
    {
      name: '나의 알림',
      url: '/user-alarm',
      icon: 'icon-puzzle',
      roles: 'all'
    }
  ]
}
