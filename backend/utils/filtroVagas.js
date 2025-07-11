function filtroVagas(vagas, perfil) {
  return vagas.filter(vaga => {
    // Pelo menos uma tecnologia em comum
    const matchTecnologias = vaga.tecnologias.some(tec => 
      perfil.tecnologias.some(userTech => 
        userTech.toLowerCase().includes(tec.toLowerCase()) || 
        tec.toLowerCase().includes(userTech.toLowerCase())
      )
    );

    // Localização: igual, vaga remota, ou cidade/estado compatível
    let matchLocalizacao = false;
    if (vaga.localizacao === 'Remoto') {
      matchLocalizacao = true;
    } else if (perfil.localizacao && vaga.localizacao) {
      // Verificar se a localização da vaga contém a cidade ou estado do usuário
      const userLocation = perfil.localizacao.toLowerCase();
      const vagaLocation = vaga.localizacao.toLowerCase();
      
      matchLocalizacao = userLocation.includes(vagaLocation) || 
                        vagaLocation.includes(userLocation) ||
                        (perfil.cidade && vagaLocation.includes(perfil.cidade.toLowerCase())) ||
                        (perfil.estado && vagaLocation.includes(perfil.estado.toLowerCase()));
    } else {
      matchLocalizacao = true; // Se não há localização definida, aceita qualquer uma
    }

    // Nível: igual ou próximo (Júnior pode aceitar Pleno, Pleno aceita ambos, Sênior aceita Pleno)
    let matchNivel = false;
    if (perfil.nivel === vaga.nivel) {
      matchNivel = true;
    } else if (perfil.nivel === 'Júnior' && vaga.nivel === 'Pleno') {
      matchNivel = true; // Júnior pode aceitar vagas Pleno
    } else if (perfil.nivel === 'Sênior' && vaga.nivel === 'Pleno') {
      matchNivel = true; // Sênior pode aceitar vagas Pleno
    } else if (perfil.nivel === 'Pleno' && (vaga.nivel === 'Júnior' || vaga.nivel === 'Sênior')) {
      matchNivel = true; // Pleno aceita vagas Júnior e Sênior
    }

    // Área: se especificada, deve ser compatível
    let matchArea = true;
    if (perfil.area && vaga.area) {
      const userArea = perfil.area.toLowerCase();
      const vagaArea = vaga.area.toLowerCase();
      
      // Mapeamento de áreas compatíveis
      const areasCompativel = {
        'frontend': ['frontend', 'full stack'],
        'backend': ['backend', 'full stack'],
        'full stack': ['frontend', 'backend', 'full stack'],
        'mobile': ['mobile', 'frontend'],
        'devops': ['devops', 'backend'],
        'data science': ['data science', 'backend'],
        'qa/testes': ['qa/testes', 'backend'],
        'ux/ui': ['ux/ui', 'frontend']
      };
      
      const areasUser = areasCompativel[userArea] || [userArea];
      matchArea = areasUser.some(area => vagaArea.includes(area));
    }

    return matchTecnologias && matchLocalizacao && matchNivel && matchArea;
  }).sort((a, b) => {
    // Ordenar por relevância (mais tecnologias em comum primeiro)
    const matchA = a.tecnologias.filter(tech => 
      perfil.tecnologias.some(userTech => 
        userTech.toLowerCase().includes(tech.toLowerCase()) || 
        tech.toLowerCase().includes(userTech.toLowerCase())
      )
    ).length;
    
    const matchB = b.tecnologias.filter(tech => 
      perfil.tecnologias.some(userTech => 
        userTech.toLowerCase().includes(tech.toLowerCase()) || 
        tech.toLowerCase().includes(userTech.toLowerCase())
      )
    ).length;
    
    return matchB - matchA;
  });
}

module.exports = filtroVagas; 