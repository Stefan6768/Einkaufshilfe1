import React from 'react'
import GruppenTag from './components/GruppenTag'
import GruppenDialog from './components/GruppenDialog'
import Modell from './model/Shopping'
import SortierDialog from "./components/SortierDialog"

/**
 * @version 1.0
 * @author Stefan Schreiber <stefan8@me.com>
 * @description Diese App ist eine Trainingsunterstützungs App mit React.js und separatem Model, welche Offline verwendet werden kann
 * @license Gnu Public Lesser License 3.0
 *
 */

/**
 * Diese Klasse steuert React.Component
 *
 * @property {constructor} 
 * @property {Gruppe}
 * @property {boolean}
 */

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aktiveGruppe: null,
      showGruppenDialog: false,
      showSortierDialog: false,
      einkaufenAufgeklappt: true,
      erledigtAufgeklappt: false
    }
  }

  componentDidMount() {
    Modell.laden()
    // Auf-/Zu-Klapp-Zustand aus dem LocalStorage laden
    let einkaufenAufgeklappt = localStorage.getItem("einkaufenAufgeklappt")
    einkaufenAufgeklappt = (einkaufenAufgeklappt == null) ? true : JSON.parse(einkaufenAufgeklappt)

    let erledigtAufgeklappt = localStorage.getItem("erledigtAufgeklappt")
    erledigtAufgeklappt = (erledigtAufgeklappt == null) ? false : JSON.parse(erledigtAufgeklappt)

    this.setState({
      aktiveGruppe: Modell.aktiveGruppe,
      einkaufenAufgeklappt: einkaufenAufgeklappt,
      erledigtAufgeklappt: erledigtAufgeklappt
    })
  }


  

  /**
   * @param {String} such
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */

  einkaufenAufZuKlappen() {
    let neuerZustand = !this.state.einkaufenAufgeklappt
    this.setState({einkaufenAufgeklappt: neuerZustand})
  }

  /**
   * Sucht
   * @param {String} suchName - Name der gesuchten Gruppe
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */

  erledigtAufZuKlappen() {
    this.setState({erledigtAufgeklappt: !this.state.erledigtAufgeklappt})
  }

  /**
   * Sucht
   * @param {String} suchName - Name der gesuchten Gruppe
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */

  artikelChecken = (artikel) => {
    artikel.gekauft = !artikel.gekauft
    const aktion = (artikel.gekauft) ? "erledigt" : "reaktiviert"
    Modell.informieren("[App] Artikel \"" + artikel.name + "\" wurde " + aktion)
    this.setState(this.state)
  }

  /**
   * Sucht
   * @param {String} suchName - Name der gesuchten Gruppe
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */

  artikelHinzufuegen() {
    // ToDo: implementiere diese Methode
    const eingabe = document.getElementById("artikelEingabe")
    const artikelName = eingabe.value.trim()
    if (artikelName.length > 0) {
      Modell.aktiveGruppe.artikelHinzufuegen(artikelName)
      this.setState(this.state)
    }
    eingabe.value = ""
    eingabe.focus()
  }

  /**
   * Sucht
   * @param {String} suchName - Name der gesuchten Gruppe
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */

  closeSortierDialog = (reihenfolge, sortieren) => {
    if (sortieren) {
      Modell.sortieren(reihenfolge)
    }
    this.setState({showSortierDialog: false})
  }

  /**
   * Sucht
   * @param {String} suchName - Name der gesuchten Gruppe
   * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
   * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
   */

  setAktiveGruppe(gruppe) {
    Modell.aktiveGruppe = gruppe
    Modell.informieren("[App] Gruppe \"" + gruppe.name + "\" ist nun aktiv")
    this.setState({aktiveGruppe: Modell.aktiveGruppe})
  }

  render() {
    let nochZuKaufen = []
    if (this.state.einkaufenAufgeklappt == true) {
      for (const gruppe of Modell.gruppenListe) {
        nochZuKaufen.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={false}
          aktiv={gruppe == this.state.aktiveGruppe}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }
    /**
     * Sucht
     * @param {String} suchName - Name der gesuchten Gruppe
     * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
     * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
     */


    let schonGekauft = []
    if (this.state.erledigtAufgeklappt) {
      for (const gruppe of Modell.gruppenListe) {
        schonGekauft.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={true}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    /**
     * Sucht
     * @param {String} suchName - Name der gesuchten Gruppe
     * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
     * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
     */

    let gruppenDialog = ""
    if (this.state.showGruppenDialog) {
      gruppenDialog = <GruppenDialog
        gruppenListe={Modell.gruppenListe}
        onDialogClose={() => this.setState({showGruppenDialog: false})}/>
    }

    /**
     * Sucht
     * @param {String} suchName - Name der gesuchten Gruppe
     * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
     * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
     */

    let sortierDialog = ""
    if (this.state.showSortierDialog) {
      sortierDialog = <SortierDialog onDialogClose={this.closeSortierDialog}/>
    }

    /**
     * Sucht eine Gruppe nach ihrem Namen und liefert sie als Objekt zurück
     * @param {String} suchName - Name der gesuchten Gruppe
     * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
     * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
     */

    return (
      <div id="container">
        <header>
          <h1>Training</h1>
          <label
            className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
            <span className="mdc-text-field__ripple"></span>
            <input className="mdc-text-field__input" type="search"
                   id="artikelEingabe" placeholder="Training hinzufügen"
                   onKeyPress={e => (e.key == 'Enter') ? this.artikelHinzufuegen() : ''}/>
            <span className="mdc-line-ripple"></span>
            <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
               tabIndex="0" role="button"
               onClick={() => this.artikelHinzufuegen()}>add_circle</i>
          </label>

        </header>
        <hr/>

        <main>
          <section>
            <h2>Training
              <i onClick={() => this.einkaufenAufZuKlappen()} className="material-icons">
                {this.state.einkaufenAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {nochZuKaufen}
            </dl>
          </section>
          <hr/>
          <section>
            <h2>Training erledigt
              <i onClick={() => this.erledigtAufZuKlappen()} className="material-icons">
                {this.state.erledigtAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {schonGekauft}
            </dl>
          </section>
        </main>
        <hr/>

        {/**
        * Sucht
        * @param {String} suchName - Name der gesuchten Gruppe
        * @param {Boolean} meldungAusgeben - steuert, ob eine Meldung ausgegeben wird
        * @returns {Gruppe | null} gefundeneGruppe - die gefundene Gruppe; `null`, wenn nichts gefunden wurde
        */}

        <footer>
          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showGruppenDialog: true})}>
            <span className="material-icons">bookmark_add</span>
            <span className="mdc-button__ripple"></span> Training
          </button>
          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showSortierDialog: true})}>>
            <span className="material-icons">sort</span>
            <span className="mdc-button__ripple"></span> Zeit
          </button>
          <button className="mdc-button mdc-button--raised">
            <span className="material-icons">settings</span>
            <span className="mdc-button__ripple"></span> Setup
          </button>
        </footer>

        {sortierDialog}
        {gruppenDialog}
      </div>
    )
  }
}

export default App
