import React from 'react';
import municipalTable from '../../img/WhatsApp Image 2026-10-26 at 09.35.28.jpeg';
import stateTable from '../../img/WhatsApp Image 2026-10-26 at 09.35.28 (1).jpeg';
import searchReferences from '../../img/WhatsApp Image 2026-10-26 at 09.35.28 (2).jpeg';

function formatVotes(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function AnalysisPage({ states }) {
  const [query, setQuery] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState(null);
  const filteredStates = states.filter((state) => `${state.state} ${state.abbreviation}`.toLowerCase().includes(query.toLowerCase()));
  const images = [
    { src: stateTable, title: 'Votos válidos por estado', file: 'WhatsApp Image 2026-10-26 at 09.35.28 (1).jpeg' },
    { src: municipalTable, title: 'Comparativo municipal 2022–2026', file: 'WhatsApp Image 2026-10-26 at 09.35.28.jpeg' },
    { src: searchReferences, title: 'Referências complementares', file: 'WhatsApp Image 2026-10-26 at 09.35.28 (2).jpeg' },
  ];

  return (
    <div className="page-stack">
      <section className="page-title-row">
        <div><p className="section-eyebrow">ARQUIVO DE REFERÊNCIA</p><h1>Dados eleitorais</h1><p className="page-subtitle">Recorte manual das tabelas e capturas compartilhadas no projeto.</p></div>
        <span className="source-badge"><span /> 3 arquivos locais</span>
      </section>

      <div className="source-warning"><span aria-hidden="true">!</span><p><strong>Transcrição para demonstração.</strong> As imagens são capturas de tela, não uma base estruturada oficial. Revise os valores na fonte original antes de qualquer publicação.</p></div>

      <section className="content-panel analysis-table-panel">
        <div className="panel-heading analysis-panel-heading">
          <div><p className="section-eyebrow">RESULTADO POR UNIDADE FEDERATIVA</p><h2>Votos válidos e diferença</h2><p className="panel-description">Amostra dos valores legíveis na captura de resultados estaduais.</p></div>
          <label className="search-control analysis-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Filtrar estado" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        <div className="table-scroll">
          <table className="data-table analysis-table">
            <thead><tr><th>ESTADO</th><th>LULA</th><th>BOLSONARO</th><th>VOTOS VÁLIDOS</th><th>DIFERENÇA</th></tr></thead>
            <tbody>{filteredStates.map((state) => (
              <tr key={state.abbreviation}>
                <td><strong>{state.state}</strong><span className="state-abbreviation">{state.abbreviation}</span></td>
                <td><span>{formatVotes(state.lulaVotes)}</span><small>{state.lulaPercent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%</small></td>
                <td><span>{formatVotes(state.bolsonaroVotes)}</span><small>{state.bolsonaroPercent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%</small></td>
                <td>{formatVotes(state.validVotes)}</td>
                <td className={state.difference >= 0 ? 'difference-positive' : 'difference-negative'}>{state.difference > 0 ? '+' : ''}{formatVotes(state.difference)}</td>
              </tr>
            ))}{filteredStates.length === 0 && <tr><td className="empty-table" colSpan="5">Nenhum estado corresponde à busca.</td></tr>}</tbody>
          </table>
        </div>
        <div className="table-note">Valores exibidos conforme legibilidade da captura fornecida. Fonte original e metodologia não foram verificadas.</div>
      </section>

      <section className="source-section">
        <div className="source-section-heading"><div><p className="section-eyebrow">ARQUIVOS ORIGINAIS</p><h2>Capturas em img/</h2></div><span>Selecione uma imagem para ampliar</span></div>
        <div className="source-gallery">
          {images.map((image) => (
            <button className="source-card" key={image.file} type="button" onClick={() => setSelectedImage(image)}>
              <span className="source-image-wrap"><img src={image.src} alt={image.title} loading="lazy" /><span className="image-zoom" aria-hidden="true">↗</span></span>
              <span className="source-card-copy"><strong>{image.title}</strong><small>{image.file}</small></span>
            </button>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="dialog-backdrop image-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedImage(null); }}>
          <section className="image-dialog" role="dialog" aria-modal="true" aria-label={selectedImage.title}>
            <div className="image-dialog-header"><span><strong>{selectedImage.title}</strong><small>{selectedImage.file}</small></span><button className="dialog-close" type="button" aria-label="Fechar imagem" onClick={() => setSelectedImage(null)}>×</button></div>
            <img src={selectedImage.src} alt={selectedImage.title} />
          </section>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;