package com.example.senseihub.ui.main

import com.example.senseihub.data.DataRepository
import org.junit.Assert.assertEquals
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.cancel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import kotlinx.coroutines.test.runTest
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class MainScreenViewModelTest {
  @Test
  fun uiState_initiallyLoading() = runTest {
    val testDispatcher = StandardTestDispatcher(testScheduler)
    Dispatchers.setMain(testDispatcher)
    val viewModel = MainScreenViewModel(FakeMyModelRepository())
    try {
      assertEquals(viewModel.uiState.value, MainScreenUiState.Loading)
    } finally {
      viewModel.viewModelScope.cancel()
      Dispatchers.resetMain()
    }
  }

  @Test
  fun uiState_repositoryEmitsData_transitionsToSuccess() = runTest {
    val testDispatcher = StandardTestDispatcher(testScheduler)
    Dispatchers.setMain(testDispatcher)
    val repository = FakeMyModelRepository()
    val viewModel = MainScreenViewModel(repository)
    try {
      val states = mutableListOf<MainScreenUiState>()
      val job = launch(testDispatcher) {
        viewModel.uiState.collect { states.add(it) }
      }
      testScheduler.advanceUntilIdle()
      assertEquals(2, states.size)
      assertEquals(MainScreenUiState.Loading, states[0])
      assertEquals(MainScreenUiState.Success(listOf("Sample")), states[1])
      job.cancel()
    } finally {
      viewModel.viewModelScope.cancel()
      Dispatchers.resetMain()
    }
  }
}

private class FakeMyModelRepository : DataRepository {
  override val data: Flow<List<String>> = flow { emit(listOf("Sample")) }
}
