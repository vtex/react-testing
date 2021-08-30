import { resolveIdentifier } from './index'

/*
  Pages: *
  Components: Header
  Selectors: categoryLink?
*/
interface NavigationOptions {
  categoryId: string
  random: boolean
  pageIndex: number
}

export function goToSearchPage(options: NavigationOptions) {
  if (!options) {
    return
  }

  if (options.categoryId) {
    cy.visit(options.categoryId)

    return true
  }

  cy.visit('/')

  cy.get('[data-testid="categoryLink"]')
    .its('length')
    .then(($length) => {
      const itemIndex = options.random
        ? Math.floor(Math.random() * $length)
        : Number(options?.pageIndex)

      cy.get(`[data-testid="categoryLink"]`)
        .eq(itemIndex)
        .click({ force: true })
    })

  return true
}

/*
  Pages: *
  Selectors: {{ param }}
*/
export function scrollToId(
  dataTestId: string[] | string,
  { cyclesLimit = 5, cycles = 1 }
): boolean {
  if (cycles >= cyclesLimit) return false

  cy.get('body').then(($body): undefined => {
    if ($body.find(resolveIdentifier(dataTestId)).length) {
      return undefined
    }

    cy.scrollTo(0, '100%')

    // For now, there is no way to wait for network calls (all of them) to be idle
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    return undefined
  })

  return scrollToId(dataTestId, { cycles: cycles + 1 })
}

/*
  Pages: {{ param }}
  Selectors: shelfPage, productSummaryContainer
*/
export function goToProductPageByShelf(
  pathUrl = '/',
  shelfIndex = 0,
  productIndex = 0
) {
  cy.location().then(($location) => {
    if ($location.pathname !== pathUrl) {
      cy.visit(pathUrl)
    }
  })

  cy.get('[data-testid="shelfPage"]')
    .eq(shelfIndex)
    .within((_) => {
      cy.get(`[data-testid="productSummaryContainer"]`).eq(productIndex).click()
    })
}
