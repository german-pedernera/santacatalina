import React from 'react';

export default function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-brand-card w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[32px] shadow-2xl border border-brand-primary/10 p-6 sm:p-10 no-scrollbar animate-pop-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-serif text-2xl font-black text-brand-dark uppercase tracking-tight">TÉRMINOS Y CONDICIONES DE USO: MARCO LEGAL Y REGULATORIO</h2>
          <button onClick={onClose} className="text-3xl text-brand-muted hover:text-brand-primary transition-all leading-none">&times;</button>
        </div>

        <div className="space-y-6 text-brand-dark/80 text-[0.9rem] leading-relaxed">
          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">1. Marco Jurídico General</h3>
            <p>El acceso y uso de la plataforma "Santa Catalina Compra Venta" se rige por la legislación vigente en la República Argentina. El usuario reconoce que cualquier actividad que infrinja las normativas aquí expuestas será pasible de sanciones civiles y penales, además de la expulsión inmediata del servicio.</p>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">2. Responsabilidad Civil y Comercial</h3>
            <p>La plataforma actúa como un mero intermediario técnico de alojamiento de contenidos (hosting), de acuerdo con la doctrina de responsabilidad de intermediarios de internet.</p>
            <p className="mt-2"><span className="font-bold">Código Civil y Comercial de la Nación (Ley 26.994):</span> Las transacciones entre usuarios constituyen contratos de compraventa en los términos de los Artículos 1123 y subsiguientes. La responsabilidad por vicios redhibitorios (defectos ocultos) y la garantía de evicción recaen exclusivamente sobre el vendedor.</p>
            <p className="mt-2"><span className="font-bold">Ley de Defensa del Consumidor (Ley 24.240):</span> Se prohíbe toda publicidad engañosa o abusiva que induzca a error al consumidor sobre la naturaleza, características o precio de los bienes y servicios.</p>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">3. Delitos Informáticos y Fraude</h3>
            <p>Toda acción orientada a defraudar a terceros mediante el uso de la plataforma será encuadrada bajo:</p>
            <p className="mt-2"><span className="font-bold">Ley de Delitos Informáticos (Ley 26.388):</span> Que tipifica y sanciona la manipulación informática, el acceso ilegítimo a bancos de datos y la defraudación mediante el uso de tarjetas de crédito o datos personales ajenos.</p>
            <p className="mt-2"><span className="font-bold">Código Penal de la Nación (Art. 172 y 173):</span> Referentes a la estafa y otras defraudaciones. "Santa Catalina" colaborará activamente con el Ministerio Público Fiscal ante cualquier requerimiento de información por actividades sospechosas.</p>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">4. Prohibiciones Específicas y Control de Sustancias</h3>
            <p>Queda terminantemente prohibida la publicación de anuncios que contravengan las siguientes normativas de orden público:</p>
            <ul className="list-disc ml-5 space-y-2 mt-2">
              <li><span className="font-bold">Régimen de Armas y Explosivos (Ley 20.429 y Decreto 395/75):</span> Prohibición de comercialización de armas de fuego, municiones y explosivos entre particulares sin la debida autorización de la ANMaC (ex-RENAR).</li>
              <li><span className="font-bold">Ley de Estupefacientes (Ley 23.737):</span> Prohibición de comercialización, ofrecimiento o publicidad de sustancias psicotrópicas o elementos destinados a su producción.</li>
              <li><span className="font-bold">Ley de Medicamentos y Productos Médicos (Ley 16.463 y Disposiciones ANMAT):</span> Se prohíbe la venta de medicamentos de cualquier tipo (venta libre o bajo receta), suplementos dietarios no autorizados y productos médicos fuera de los establecimientos habilitados.</li>
              <li><span className="font-bold">Ley de Marcas y Designaciones (Ley 22.362):</span> Se prohíbe la oferta de productos falsificados o que vulneren derechos de propiedad industrial.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">5. Protección de Datos y Privacidad</h3>
            <p><span className="font-bold">Ley de Protección de Datos Personales (Ley 25.326) y su Decreto Reglamentario 1558/2001:</span> Los usuarios tienen derecho al acceso, rectificación y supresión de sus datos. La plataforma no cederá información a terceros, salvo orden judicial expresa en el marco de una investigación penal.</p>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">6. Cumplimiento Fiscal</h3>
            <p>Los usuarios son responsables exclusivos del cumplimiento de sus obligaciones tributarias ante la Administración Federal de Ingresos Públicos (AFIP) y la Administración Provincial de Impuestos (API), incluyendo el pago del IVA, Impuesto a las Ganancias e Ingresos Brutos cuando la habitualidad de la actividad comercial así lo requiera.</p>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">7. Jurisdicción y Competencia</h3>
            <p>Para cualquier diferendo legal que surja del uso de la plataforma, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Segunda Circunscripción Judicial de la Provincia de Córdoba, con asiento en la ciudad de Río Cuarto, renunciando de forma expresa a cualquier otro fuero o jurisdicción (incluido el Federal) que pudiera corresponder.</p>
          </section>

          <section>
            <h3 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2">8. Vigencia y Caducidad de las Publicaciones</h3>
            <p>Con el objetivo de mantener la plataforma actualizada y garantizar la relevancia de las ofertas para la comunidad, se establece el siguiente régimen de permanencia:</p>
            <ul className="list-disc ml-5 space-y-2 mt-2">
              <li><span className="font-bold">Plazo de Vigencia:</span> Toda publicación realizada por un usuario tendrá una vigencia máxima de diez (10) días corridos a partir de la fecha y hora de su creación.</li>
              <li><span className="font-bold">Caducidad Automática:</span> Cumplido dicho plazo, el sistema procederá a la baja automática del anuncio sin necesidad de previa notificación al usuario.</li>
              <li><span className="font-bold">Renovación:</span> Finalizado el periodo de diez días, el interesado podrá realizar una nueva publicación del artículo o servicio, siempre que este continúe cumpliendo con los estándares legales y de convivencia establecidos en el presente documento.</li>
              <li><span className="font-bold">Responsabilidad de Actualización:</span> Es responsabilidad exclusiva del usuario dar de baja la publicación de manera anticipada si la transacción se hubiera concretado antes del vencimiento del plazo de diez días, a fin de evitar confusiones o reclamos de terceros.</li>
            </ul>
          </section>

          <section className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
            <p className="font-bold italic">Al utilizar este servicio, usted declara ser mayor de edad y poseer la capacidad legal para contratar y obligarse según los términos aquí expuestos.</p>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg hover:brightness-110 transition-all"
        >
          He leído y acepto los términos
        </button>
      </div>
    </div>
  );
}
