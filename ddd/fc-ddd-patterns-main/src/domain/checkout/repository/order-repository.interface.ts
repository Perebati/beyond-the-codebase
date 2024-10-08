import RepositoryInterface from "../../@shared/repository/repository-interface";
import Order from "../entity/order";

/*
Nesse desafio você deverá fazer com que a classe OrderRepository implemente totalmente os métodos definidos pelo OrderRepositoryInterface. 
Toda essa implementação deverá ser reproduzida através de testes.
Após realizar tal implementação submeta seu projeto, nesse ponto todos os testes devem estar passando.
Boa sorte.
A linguagem de programação para este desafio é TypeScript
*/

export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {
}