/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import Bills, {handleClickIconEye} from '../containers/Bills.js'
import userEvent from '@testing-library/user-event'

import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))

      //to-do write expect expression
      expect(screen.getByTestId("icon-window")).toBeTruthy()
      expect(screen.getByTestId("icon-window").classList.contains("active-icon")).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test('checks that the handleClickNewBill function navigates to the "NewBill" route', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const mockOnNavigate = jest.fn();
      const component = new NewBillUI();
      component.handleClickNewBill();
    
      expect(mockOnNavigate).toBeCalledWith(ROUTES_PATH['NewBill']);
    });

    test("Then I click on the eye icon should display the bill image in the modal", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const sampleBillsUI = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })

      sampleBillsUI.handleClickIconEye = jest.fn();
      screen.getAllByTestId('icon-eye')[0].click();
      expect(sampleBillsUI.handleClickIconEye).toBeCalled();

      //const handleClickIconEye = jest.fn(BillUI.handleClickIconEye)
      //const eye = screen.getByTestId('icon-eye')[0]
      // const eye = document.querySelector('[data-testid="icon-eye"]:first-child')
      // eye.addEventListener('click', handleClickIconEye(eye))
      // userEvent.click(eye)
      // expect(handleClickIconEye).toHaveBeenCalled()

      //const modale = screen.getByTestId('modaleFile')
      //expect(screen.getByTestId('modaleFile').classList.contains("show")).toBeTruthy()
    })
  })

  
})
